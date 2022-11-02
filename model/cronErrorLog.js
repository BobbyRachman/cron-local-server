const mongoose = require('mongoose')

const CronErrorLog = mongoose.model('cronErrorLog',{
    marketplace : {
        type : String
    },
    store_id : {
        type : String
    },
    shopid : {
        type : String
    },
    order_id : {
        type : String
    },
    shipper_mp : {
        type  : String
    },
    mp_status : {
        type : String
    },
    error_log : {
        type : String
    },
    tms : {
        type : Date,
        default : Date.now
    },
},'cronErrorLog')

module.exports = CronErrorLog;