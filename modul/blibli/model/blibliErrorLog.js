const mongoose = require('mongoose')

const BlibliErrorLog = mongoose.model('BlibliErrorLog',{
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
},'blibliErrorLog')

module.exports = BlibliErrorLog