const mongoose = require('mongoose')

const ZaloraCron = mongoose.model('ZaloraCron',{
    start_date : {
        type : Date
    },
    end_date : {
        type : Date
    },
    n_transaction : {
        type : Number
    },
    tms : {
        type : Date,
        default : Date.now
    },
    fk_store : {
        type : Number
    },
    marketplace : {
        type : String
    },
    action : {
        type : String,
        default : null
    },
    shopid : {
        type : String
    }
},'zaloraCronLog')

module.exports = ZaloraCron;