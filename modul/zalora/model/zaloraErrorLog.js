const mongoose = require('mongoose')

const ZaloraErrorLog = mongoose.model('ZaloraErrorLog',{
    error : {
        type : String
    },
    error_no : {
        type : String
    },
    order_id : {
        type : String
    },
    shopid : {
        type : String
    },
    start_date : {
        type : Date,
        default : null
    },
    end_date : {
        type : Date,
        default : null
    }
},'zaloraErrorLog')

module.exports = ZaloraErrorLog;