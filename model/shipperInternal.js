const mongoose = require('mongoose')

const shipperInternal = mongoose.model('shipperInternal',{
    mp : {
        type : String
    },
    shipper_internal : {
        type : String
    },
    shipper_mp : {
        type : String
    },
    notes : {
        type : String
    },
    created_at : {
        type : Date,
        default : Date.now
    }
},'shipperInternal')

module.exports = shipperInternal;