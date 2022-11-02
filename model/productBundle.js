const mongoose = require('mongoose');
const { Schema } = mongoose;

const productBundleCollection = new Schema ({
    sku : {
        type : String
    },
    label : {
        type : String
    },
    fk_product : {
        type : Number
    },
    fk_sku : {
        type : String
    },
    qty : {
        type  : Number
    },
    price : {
        type : Number
    },
    fk_user_create : {
        type : Number
    },
    sku1 : {
        type : String
    },
    tms : {
        type : Date,
        default : Date.now
    }
})

productBundleCollection.index({
    sku : 1,
    fk_sku : 1,
},{
    unique : true
})

module.exports = mongoose.model('productBundleCollection',productBundleCollection,'productBundle');