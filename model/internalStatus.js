const mongoose = require('mongoose')

const internalStatus = mongoose.model('internalStatus',{
    createdAt : {
        type : Date,
        default : Date.now
    },
    internal_status : {
        type : String
    },
    mp : {
        type : String
    },
    mp_status : {
        type : String
    },
    notes : {
        type : String
    }
},'internalStatus')

module.exports = internalStatus;