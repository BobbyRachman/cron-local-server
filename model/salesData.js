const mongoose = require('mongoose')
const { Schema } = mongoose

let SalesData = new Schema({
    create_date : { type : Date },
    payment_date : { type : Date },
    invoice_no : { type : String },
    marketplace : { type : String },
    store_name : { type : String },
    item_sku : {type : String},
    item_name : { type : String },
    province : {type : String},
    qty : { type : Number },
    total : { type : Number },
    grand_total : { type : Number },
    internal_sts : {type : String},
    tms : { type : Date,default : Date.now }
})

SalesData.index({
    invoice_no : 1,
    item_sku : 1
},{
    unique : true
})

module.exports = mongoose.model('SalesData',SalesData,'salesData');

