var express = require('express')
var con = require('../../../config/db')
var request = require('request')
var axios = require('axios')
var moment = require('moment')
var cron = require('node-cron')
var SqlQuery = require('../../helper/Query')

var Marketplace = require('../../../model/marketplace');
var ShipperInternal = require('../../../model/shipperInternal');
var InternalStatus = require('../../../model/internalStatus');
var CronErrorLog = require('../../../model/cronErrorLog');
var AllOrder = require('../../../model/allOrder');
var AllOrderNotCompletedAt = require("../../../model/allOrderNotCompletedAt")
const allOrderNotCompletedAt = require('../../../model/allOrderNotCompletedAt');
const allOrdersMeteor = require('../../../model/allOrdersMeteor');

moment.tz.setDefault("Asia/Jakarta");

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addslashes(str) {
    return (str + '').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
}

function clean(data) {
    data = data.trim()
    data = data.replace(/\\/g, '')
    data = escapeHtml(data)
    data = addslashes(data)
    return data
};

function makeRequest(path) {
    return new Promise(function (resolve, reject) {
        axios.get(path).then(
            (response) => {
                var result = response.data;
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

module.exports = cron.schedule('49 7 * * *', async () => {
    try {
        console.log("Update Completed At Start");

        let getData = await allOrderNotCompletedAt.find({});
        for (let data of getData) {
            let order_id = data.order_id;
            let invoice_no = data.invoice_no;

            let getDataMeteor = await allOrdersMeteor.findOne({
                $and: [
                    { "order_id": order_id },
                    { "invoice_no": invoice_no }
                ]
            });

            if (getDataMeteor) {
                // console.log(getDataMeteor)
                // Send to API
                var options = {
                    'method': 'POST',
                    'url': 'http://localhost:3004/getOrders/updateCompletedAt',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(getDataMeteor)
                };

                request(options, async function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Update Invoice : "+invoice_no+"");
                    }
                });
            }

        }

        console.log("Update Completed At End")
    } catch (error) {
        console.log(error)
    }
})