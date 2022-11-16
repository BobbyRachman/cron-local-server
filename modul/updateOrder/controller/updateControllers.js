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

module.exports = cron.schedule('5 19 * * *',async ()=>{
    try {
        let startDate = new Date("2022-11-09T17:00:00.000Z");
        let endDate = new Date();

        let getDataOrderLocal = await AllOrder.find({$and : [
            {"create_date" : {$gte : startDate}},
            {"create_date" : {$lte : endDate}},
            {"validasi1status" : true},
            {"uploadCompletedStatus" : {$ne : true}}
        ]});

        let dataSend = {
            status : "success",
            data : getDataOrderLocal
        };

        // Send to API
        var options = {
          'method': 'POST',
          'url': 'http://localhost:3004/getOrders/updateOrders',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataSend)
        };
        
        request(options, async function (error, response) {
          if (error){
            console.log(error)
          } else {
            let dataResponse = JSON.parse(response.body);
            if(dataResponse.code == 200){
                for(let dataUpdate of getDataOrderLocal){
                    let dataid = dataUpdate._id;
                    let invoice_no = dataUpdate.invoice_no;
                    let validasi2status = dataUpdate.validasi2status;
                    let uploadStatus = true;
                    let uploadDataAt = new Date();
                    let uploadCompletedStatus = validasi2status == true ? true : false;
                    let uploadCompletedAt = new Date();

                    let dataforUpdate = {
                        invoice_no,
                        uploadStatus,
                        uploadDataAt,
                        uploadCompletedAt,
                        uploadCompletedStatus
                    };
                    let updateData = await AllOrder.findByIdAndUpdate(dataid,dataforUpdate)
                    console.log(invoice_no)
                };

                console.log("Update Done")
            } else {
                console.log("Error")
            }
            
          }
          
        }); 
    } catch (error) {
        console.log(error)
    }
})