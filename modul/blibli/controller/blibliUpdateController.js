var express = require('express')
var con = require('../../../config/db')
var request = require('request')
var axios = require('axios')
var https = require('https')
var moment = require('moment')
var cron = require('node-cron')
var Marketplace = require('../../../model/marketplace');
var ShipperInternal = require('../../../model/shipperInternal');
var InternalStatus = require('../../../model/internalStatus');
var CronErrorLog = require('../../../model/cronErrorLog');
var AllOrder = require('../../../model/allOrder')
var BlibliOrder = require('../model/blibliModel');
var BlibliCronLog = require('../model/blibliCron');
var BlibliErrorLog = require('../model/blibliErrorLog');

const agent = new https.Agent({
    rejectUnauthorized : false
})

function escapeHtml(text) {
    return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function addslashes( str ) {  
    return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");  
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
        axios.get(path,{httpsAgent : agent}).then(
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

module.exports = cron.schedule('*/30 * * * *', async ()=>{
    try {
        console.log("Blibli Update Start")
        let shops = await Marketplace.find({"sts" : 1,"fk_channel" : 16});
        let marketplaceId = "blibli"
        for(let shop of shops){
            let shopid = shop.shopid;
            let fk_brand = parseInt(shop.fk_brand);

            let e3 = await AllOrder.find({ $and : [{"store_id" : shopid}, {"marketplace_status" : { $ne : null }}, {"internal_status" : { $nin : ['CANCELED','RETURNED','COMPLETED'] }}] });
            let nTransaction1 = 0
            if(e3.length > 0){
                for(let r3 of e3){
                    try {
                        let order_id = r3.order_id;
                        let invoice_no = r3.invoice_no;
                        let store_name = r3.store_name

                        let endpoint = "http://localhost:3004/getOrders/singleOrders?mp="+marketplaceId+"&brand="+store_name+"&orderId="+order_id+"";
                        let reqOrder = await makeRequest(endpoint);
                        let orders = reqOrder.data;
                        for(let r of orders){
                            let shipper_mp = r.shipper_mp;
                            let shipper_internal = r.shipper_internal;
                            let tracking_no = r.tracking_no;
                            let marketplace_status = r.marketplace_status;
                            let internal_status = r.internal_status;
                            let payment_date = r.payment_date != null ? new Date(r.payment_date) : null;
                            let delivery_date = r.delivery_date != null ? new Date(r.delivery_date) : null;
                            let completion_date = r.completion_date != null ? new Date(r.completion_date) : null;


                            let dataUpdate = {
                                order_id,
                                invoice_no,
                                store_name,
                                tracking_no,
                                shipper_mp,
                                shipper_internal,
                                marketplace_status,
                                internal_status,
                                payment_date,
                                delivery_date,
                                completion_date,
                                updatedAt : new Date()
                            };

                            console.log(dataUpdate)
                            let UpdateAllOrder = await AllOrder.findOneAndUpdate({ $and : [{"order_id" : order_id}, {"store_id" : shopid}] },dataUpdate);
                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
        console.log("Blibli Update End")
    } catch (error) {
        console.log(error)
    }
})