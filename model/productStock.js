const mongoose = require('mongoose');
const { Schema } = mongoose;

const productStockCollection = new Schema ({
    rowid : {
        type : Number
    },
    tms : {
        type : Date,
        default : Date.now
    },
    fk_product : {
        type : Number
    },
    fk_entrepot : {
        type : Number
    },
    reel : {
        type  : Number
    },
    import_key : {
        type : String
    },
    expired_date : {
        type : Date
    },
    stock_adjustment : {
        type : Number
    },
    date_adjustment : {
        type : Date
    }
})

productStockCollection.index({
    rowid : 1,
    fk_product : 1,
},{
    unique : true
})

module.exports = mongoose.model('productStockCollection',productStockCollection,'productStock');