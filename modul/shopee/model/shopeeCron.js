const mongoose = require('mongoose')

const ShopeeCron = mongoose.model('ShopeeCron',{
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
        type : Number
    }
},'shopeeCronLog')

module.exports = ShopeeCron