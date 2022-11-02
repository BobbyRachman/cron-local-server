const mongoose = require('mongoose')

const Marketplace = mongoose.model('shopMp',{
    brand : {  
        type : String
    },
    channel : {
        type : String
    },
    rowid : {
        type : String
    },
    fk_user_create : {
        type : String
    },
    tms : {
        type : String
    },
    fk_channel : {
        type : String
    },
    fk_brand : {
        type : String
    },
    uid : {
        type : String
    }, 
    pwd : {
        type : String
    }, 
    shopid : {
        type : String
    },
    shopname : {
        type : String
    },
    acc_token : {
        type : String
    },
    ref_token : {
        type : String
    },
    fsid : {
        type : String,
        default : null
    },
    apiuid : {
        type : String
    },
    apipwd : {
        type : String
    },
    apikey : {
        type : String
    },
    sts : {
        type : String
    },
    rank : {
        type : String
    },
    api_date : {
        type : String
    },
    quit_date : {
        type : String
    },
    note : {
        type : String
    },
    createdAt : {
        type : Date
    },
    updateAt : {
        type : Date
    },
    lastInsertDate : {
        type : Date
    },
    status_insert : {
        type : String
    },
    error_msg : {
        type : String
    },
    lastErrorDate : {
        type : Date
    },
    status_live : {
        type : Boolean
    }
},'shopMp')

module.exports = Marketplace