const mongoose = require('mongoose')

const TokopediaErrorLog = mongoose.model('TokopediaErrorLog',{
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
},'tokopediaErrorLog')

module.exports = TokopediaErrorLog