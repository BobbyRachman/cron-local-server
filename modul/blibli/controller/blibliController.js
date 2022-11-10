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
var blibliCronLog = require('../model/blibliCron');

moment.tz.setDefault("Asia/Jakarta");

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

module.exports = cron.schedule('*/5 * * * *',async ()=>{
  try {
    console.log("Blibli Start");
    // Get Bukalapak's Shops from DB
    let shops = await Marketplace.aggregate([{$lookup:{from: "categorieMp",localField: "fk_brand",foreignField: "rowid",as: "detail_brand"}}, {$match:{'fk_channel' : '16','sts':'1'}}]);
    let marketplaceId = "blibli";
    for(let shop of shops){
      try {
        let brand_name = shop.brand;
        let shopid =shop.shopid;
        let fk_brand = shop.fk_brand;
        let status_fulfillment = shop.detail_brand[0].status_fulfillment;
        // Check Cron Data From llx_cron_log_bukalapak
        let checkCron = await blibliCronLog.find({ $and : [{"shopid" : shopid}, {"start_date" : { $ne : null }}] }, {"start_date": 1,"end_date": 1}).sort({"start_date": -1});
        if(checkCron.length === 0){
          var dataCron = {
            start_date : new Date("2022-09-20T17:00:00.000Z"),
            end_date : new Date("2022-09-21T17:00:00.000Z"),
            marketplace : marketplaceId,
            n_transaction : 0,
            fk_store : fk_brand,
            shopid : shopid
          }
          await blibliCronLog.create(dataCron);
        }

        // Check data from llx_egogosales_uat_shopee to get Last Create Date
        var salesOrder = await AllOrder.find({"store_id" : shopid}, {"create_date": 1}).sort({"create_date": -1}).limit(1);
        let sd
        if(salesOrder.length > 0){
          sd = salesOrder[0].create_date;
          // console.log('sdLastOrder:' + sd);
        } else {
          var data = {
            order_id : shopid,
            marketplace : marketplaceId,
            create_date :new Date("2022-09-21T15:00:00.000Z"),
            store_id : shopid
          }

          sd = new Date("2022-09-21T15:00:00.000Z");
          await AllOrder.create(data);
        }

        var ed = new Date();
        var datenow = new Date();

        // Get result from datenow - sd
        var diff = (datenow - sd)/(1000 * 60 * 60);

        // --> Start Alghoritm to Get Start Date and End Date 
        if(diff >= 24){
          // console.log("ALG 2")
          let queryCron = await blibliCronLog.find({ $and : [{"shopid" : shopid}, {"start_date" : { $ne : null }}] }, {"start_date": 1,"end_date": 1,"n_transaction" : 1}).sort({"start_date": -1});
          let cronDate = queryCron[0];
    
          let sd_cron = cronDate.start_date;
          let ed_cron = cronDate.end_date;
          let ntrans = cronDate.n_transaction;
          let getEd = new Date(sd_cron);

          if(sd<=sd_cron){
            // console.log("ALG 4")
            sd = ed_cron
            ed = new Date(moment(sd).add(1,'days').format())
            
            if(ed>datenow){
              // console.log("ALG 6")
              ed = datenow
            }
          } else {
            // console.log("ALG 5")
            if(ntrans <= 1){
              sd = ed_cron
            }
            ed = new Date(moment(sd).add(1,'days').format())
            if(ed > datenow){
              // console.log("ALG 6")
              ed = datenow
            }
          }

          
        } else {
            // console.log("ALG 3")
            ed = new Date()
        }
        // --> End Alghoritm to Get Start Date and End Date 
  
        // Get Start Date and End Date from Alghoritm
        let startDate = moment(sd).toISOString();
        let endDate = moment (ed).toISOString();

        let offset = 0;
        let limit = 100;
        // Endpoint for All Order
        var endpoint = 'http://localhost:3004/getOrders/allOrders?sd='+startDate+'&ed='+endDate+'&mp='+marketplaceId+'&brand='+brand_name+'&offset='+offset+'&limit='+limit+'';
        
        // Request Data from  API All Order
        let reqAllOrder = await makeRequest(endpoint);
        let nTransaction1 = 0;
        let dataAllOrder = reqAllOrder.data;

        let cres = 1;
        while(cres > 0){
            for(let data of dataAllOrder){
                nTransaction1++
                let dataOrder = data;
                delete dataOrder['_id'];
                let order_id = dataOrder.order_id;
                let invoice_no = dataOrder.invoice_no;
                let CheckAllOrders = await AllOrder.find({ $and : [{"order_id" : order_id}, {"invoice_no" : invoice_no}] });
                if(CheckAllOrders.length > 0){
                  // let UpdateAllOrder = await AllOrder.findOneAndUpdate({ $and : [{"order_id" : order_id}, {"invoice_no" : invoice_no}] },dataOrder)
                } else {
                  let InsertAllOrder = await AllOrder.create(dataOrder)
                }
            }
            offset += limit;
            endpoint = 'http://localhost:3004/getOrders/allOrders?sd='+startDate+'&ed='+endDate+'&mp='+marketplaceId+'&brand='+brand_name+'&offset='+offset+'&limit='+limit+'';
            reqAllOrder = await makeRequest(endpoint);
            dataAllOrder = reqAllOrder.data;
            cres = dataAllOrder.length > 0 ? 1 : 0;

        }
        
        if(nTransaction1){
          nTransaction1 = nTransaction1
        } else {
            nTransaction1 = 0
        }
    
        var cronLog = {
            start_date : new Date(startDate),
            end_date : new Date(endDate),
            n_transaction : nTransaction1,
            fk_store : fk_brand,
            marketplace : marketplaceId,
            action : 'getAllOrders',
            shopid : shopid
        }
    
        await blibliCronLog.create(cronLog);

        await AllOrder.deleteOne({"order_id" : shopid});

      } catch (error) {
        console.log(error)
      }
    }

    console.log("Blibli End")
    
  } catch (error) {
    console.log(error.message)
  }
})