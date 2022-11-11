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
var zaloraCronLog = require('../model/zaloraCron');

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
}

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

module.exports = cron.schedule('*/20 * * * *', async () => {
    try {
        console.log("Zalora 1 Start");
        let curr = new Date();
        let dateNow = moment(curr).format('YYYY-MM-DD');
        // let dateYesterday = moment(dateNow).add(-1, 'days').format('YYYY-MM-DD');
        let start_date = dateNow + ' 00:00:00';
        let end_date = dateNow + ' 23:59:59';
        let sd = moment(start_date).format('YYYY-MM-DD HH:mm:ss');
        let ed = moment(end_date).format('YYYY-MM-DD HH:mm:ss');
        // Get Bukalapak's Shops from DB
        let shops = await Marketplace.aggregate([{ $lookup: { from: "categorieMp", localField: "fk_brand", foreignField: "rowid", as: "detail_brand" } }, { $match: { 'fk_channel': '27', 'sts': '1' } }]);
        let marketplaceId = "zalora";
        for (let shop of shops) {
            try {
                let brand_name = shop.brand;
                let shopid = shop.shopid;
                let fk_brand = shop.fk_brand;
                let status_fulfillment = shop.detail_brand[0].status_fulfillment;
                let offset = 0;
                let limit = 100;

                // Get Start Date and End Date from Alghoritm
                let startDate = moment(sd).toISOString();
                let endDate = moment(ed).toISOString();

                // Endpoint for All Order
                var endpoint = 'http://localhost:3004/getOrders/allOrders?sd=' + startDate + '&ed=' + endDate + '&mp=' + marketplaceId + '&brand=' + brand_name + '&offset=' + offset + '&limit=' + limit + '';

                // Request Data from  API All Order
                let reqAllOrder = await makeRequest(endpoint);
                let nTransaction1 = 0;
                let dataAllOrder = reqAllOrder.data;

                let cres = 1;
                while (cres > 0) {
                    for (let data of dataAllOrder) {
                        nTransaction1++
                        let dataOrder = data;
                        delete dataOrder['_id'];
                        let order_id = dataOrder.order_id;
                        let invoice_no = dataOrder.invoice_no;
                        let CheckAllOrders = await AllOrder.find({ $and: [{ "order_id": order_id }, { "invoice_no": invoice_no }] });
                        if (CheckAllOrders.length == 0) {
                            let InsertAllOrder = await AllOrder.create(dataOrder)
                        }
                    }
                    offset += limit;
                    endpoint = 'http://localhost:3004/getOrders/allOrders?sd=' + startDate + '&ed=' + endDate + '&mp=' + marketplaceId + '&brand=' + brand_name + '&offset=' + offset + '&limit=' + limit + '';
                    reqAllOrder = await makeRequest(endpoint);
                    dataAllOrder = reqAllOrder.data;
                    cres = dataAllOrder.length > 0 ? 1 : 0;

                };

            } catch (error) {
                console.log(error)
            }
        }

        console.log("Zalora 1 End")

    } catch (error) {
        console.log(error.message)
    }
})