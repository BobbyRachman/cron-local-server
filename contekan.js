var express = require('express')
var con = require('../../../config/db')
var request = require('request')
var axios = require('axios')
var moment = require('moment')
var cron = require('node-cron')
var Marketplace = require('../../../model/marketplace');
var AllOrder = require('../../../model/allOrder')
var ShopeeOrder = require('../model/shopeeModel');
var ShopeeCronLog = require('../model/shopeeCron');
var ShipperInternal = require('../../../model/shipperInternal');
var InternalStatus = require('../../../model/internalStatus');
var CronErrorLog = require('../../../model/cronErrorLog')
var transporterMail = require('../../helper/transporter')
var skeleton = require('../../helper/skeleton')

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
    return new Promise(function(resolve, reject) {
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

module.exports = cron.schedule('26 14 * * *', async() => {
    try {
        console.log("Shopee Update Start")
        let shops = await Marketplace.find({ "sts": "1", "fk_channel": "14" });
        let marketplaceId = "shopee"
        if (shops.length > 0) {
            for (let shop of shops) {
                let shopid = shop.shopid;
                let fk_brand = shop.fk_brand;

                console.log(shopid + " Start")
                let nUpdate = 0
                // let e3 = await AllOrder.find({ $and: [{ "store_id": shopid }, { "marketplace_status": { $ne: null } }, { "internal_status": { $nin: ['CANCELED', 'RETURNED', 'COMPLETED'] } }] });
                let e3 = await AllOrder.find({ $and: [{ "store_id": "399297370" }, { "marketplace_status": { $ne: null } }, { "internal_status": { $nin: ['CANCELED', 'RETURNED', 'COMPLETED'] } }] });
                if (e3.length > 0) {
                    for (let r3 of e3) {
                        try {
                            // Endpoint Single Order
                            // let endpointSO = 'http://35.197.145.25/sync_shopee_v2.php?act=getSingleOrderItem&shopid=' + shopid + '&orderid=' + r3.order_id + '';
                            let endpointSO = 'http://35.197.145.25/sync_shopee_v2.php?act=getSingleOrderItem&shopid=399297370&orderid=' + r3.order_id + '';
                            // Request from API Single Order
                            let rq = await makeRequest(endpointSO);
                            if (rq.response.response.order_list != "" && rq.response.response.order_list != null) {
                                let orders = rq.response.response.order_list
                                for (let r of orders) {
                                    try {
                                        // nUpdate++
                                        console.log(r)
                                        // // ETL for Update Data
                                        // let order_id = r.order_sn
                                        // let salesorder_no = order_id

                                        // let payment_date = r.pay_time != undefined && r.pay_time != null && r.pay_time != "" ? moment(new Date(r.pay_time * 1000)).format('YYYY-MM-DD HH:mm:ss') : null;
                                        // let epTrackingNo = 'http://35.197.145.25/sync_shopee_v2.php?act=getTrackingNo&shopid='+shopid+'&orderid='+order_id+'';
                                        // let tracking_no
                                        // try {
                                        //     let getTrackingNo = await makeRequest(epTrackingNo);  
                                        //     tracking_no = getTrackingNo.response.tracking_number;  
                                        // } catch (error) {
                                        //     tracking_no = ''
                                        // }
                                        // // let tracking_no = r.tracking_no;
                                        // let shipper_mp = r.package_list[0].shipping_carrier;
                                        // let checkInternalShipper = await ShipperInternal.find({ $and: [{ "shipper_mp": shipper_mp }, { "mp": marketplaceId }] });
                                        // // Get shipper_internal data from llx_shipper_internal
                                        // // let shipper_internal = checkInternalShipper.length > 0 ? checkInternalShipper[0].shipper_internal : "";
                                        // let shipper_internal
                                        // if (checkInternalShipper.length > 0) {
                                        //     shipper_internal = checkInternalShipper[0].shipper_internal;
                                        // } else {
                                        //     if (shipper_mp != "" && shipper_mp != null && shipper_mp != undefined) {
                                        //         let intShipError = {
                                        //             marketplace: marketplaceId,
                                        //             store_id: fk_brand,
                                        //             shopid: shopid,
                                        //             order_id: order_id,
                                        //             shipper_mp: shipper_mp,
                                        //             mp_status: null,
                                        //             error_log: "Invalid Shipper Internal",
                                        //             tms: new Date()
                                        //         }
                                        //         await CronErrorLog.create(intShipError);
                                        //     }
                                        //     shipper_internal = ""
                                        // }

                                        // let cancel_by = r.cancel_by != '' ? r.cancel_by : '';
                                        // let cancel_reason = r.cancel_reason != '' ? `${cancel_by}, ` + r.cancel_reason : cancel_by
                                        // let cancel_reason_detail = r.cancel_reason
                                        // let channel_status = r.order_status
                                        // let internal_status

                                        // let CheckInternalStatus = await InternalStatus.find({ $and: [{ "mp": marketplaceId }, { "mp_status": channel_status }] });
                                        // if (CheckInternalStatus.length > 0) {
                                        //     internal_status = CheckInternalStatus[0].internal_status;
                                        // } else {
                                        //     // If data channel_status is not in llx_egogo_internal_status, store missing internal_status to db
                                        //     let intStatError = {
                                        //         marketplace: marketplaceId,
                                        //         store_id: fk_brand,
                                        //         shopid: shopid,
                                        //         order_id: order_id,
                                        //         shipper_mp: null,
                                        //         mp_status: channel_status,
                                        //         error_log: "Invalid Internal Status",
                                        //         tms: new Date()
                                        //     }
                                        //     await CronErrorLog.create(intStatError);
                                        //     internal_status = null
                                        // }
                                        // let delivery_date = channel_status == 'SHIPPED' && r.update_time != null ? moment(new Date(r.update_time * 1000)).format('YYYY-MM-DD HH:mm:ss') : null;
                                        // let completion_date = r.update_time != null && (channel_status == 'CANCELLED' || channel_status == 'COMPLETED' || channel_status == 'TO_RETURN') ? moment(new Date(r.update_time * 1000)).format('YYYY-MM-DD HH:mm:ss') : null;

                                        // // Object of ETL data, to Update on llx_egogosales_uat_shopee
                                        // let dataEgogosales = {
                                        //     order_id,
                                        //     salesorder_no,
                                        //     payment_date,
                                        //     tracking_no,
                                        //     shipper_mp,
                                        //     shipper_internal,
                                        //     cancel_reason,
                                        //     cancel_reason_detail,
                                        //     marketplace_status: channel_status,
                                        //     internal_status: internal_status,
                                        //     delivery_date,
                                        //     completion_date,
                                        //     updatedAt: new Date()
                                        // }
                                        // // // console.log('dataEgogosales:' + JSON.stringify(dataEgogosales))
                                        // let UpdateAllOrder = await AllOrder.findOneAndUpdate({ $and: [{ "order_id": r3.order_id }, { "store_id": shopid }] }, dataEgogosales);
                                        // let UpdateOrder = await ShopeeOrder.findOneAndUpdate({ $and: [{ "order_id": r3.order_id }, { "store_id": shopid }] }, dataEgogosales);
                                        // if(UpdateAllOrder){
                                        //     console.log("(Shopee) Updating order_id : "+order_id+"")
                                        // }
                                    } catch (error) {
                                        console.log(error.message)
                                    }

                                }
                            }
                        } catch (error) {
                            console.log(error.message)
                        }

                    }
                }

                console.log(""+shopid+" : "+nUpdate+" data")
            }
        } else {
            console.log("No shops")
        }
        console.log("Shopee Update End")
    } catch (error) {
        throw error;
    }
})