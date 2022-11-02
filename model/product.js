const mongoose = require('mongoose')
const { Schema } = mongoose

let productCollection = new Schema({
    rowid : {
        type : Number
    },
    brand : {
        type : String
    },
    fk_brand : {
        type : Number
    },
    ref : {
        type : String
    },
    entity : {
        type : Number
    },
    ref_ext : {
        type : String,
        default : null
    },
    datec :{
        type : Date
    },
    tms : {
        type : Date
    },
    fk_parent : {
        type : Number
    },
    label : {
        type : String
    },
    description : {
        type : String
    },
    note_public : {
        type : String,
        default : null
    },
    note : {
        type : String,
    },
    customcode : {
        type : String
    },
    fk_country : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
    },
    price_ttc : {
        type : Number,
    },
    price_min : {
        type : Number,
    },
    price_min_ttc : {
        type : Number,
    },
    price_base_type : {
        type : String,
    },
    cost_price : {
        type : Number,
    },
    gmv_price : {
        type : Number,
    },
    default_vat_code : {
        type : String,
        default : null
    },
    tva_tx : {
        type : Number,
    },
    recuperableonly : {
        type : Number,
    },
    localtax1_tx:{
        type : Number
    },
    localtax1_type:{
        type : String
    },
    localtax2_tx:{
        type : Number
    },
    localtax2_type:{
        type : String
    },
    fk_user_author : {
        type : Number
    },
    fk_user_modif : {
        type : Number
    },
    tosell : {
        type : Number
    },
    tobuy : {
        type : Number
    },
    onportal : {
        type : Number
    },
    tobatch : {
        type : Number
    },
    fk_product_type : {
        type : Number
    },
    duration : {
        type : String
    },
    seuil_stock_alerte : {
        type : String,
        default : null
    },
    url : {
        type : String,
        default : null
    },
    barcode : {
        type : String,
        default : null
    },
    fk_barcode_type : {
        type : Number,
        default : null
    },
    accountancy_code_sell :{
        type : String
    },
    accountancy_code_sell_intra :{
        type : String
    },
    accountancy_code_sell_export :{
        type : String
    },
    accountancy_code_buy :{
        type : String
    },
    partnumber : {
        type : Number,
        default : null
    },
    weight : {
        type : Number,
        default : null
    },
    weight_units : {
        type : Number
    },
    length : {
        type : Number,
        default : null
    },
    length_units : {
        type : Number
    },
    width : {
        type : Number,
        default : null
    },
    width_units :{
        type : Number
    },
    height : {
        type : Number,
        default : null
    },
    height_units : {
        type : Number
    },
    surface : {
        type : Number,
        default : null
    },
    surface_units : {
        type : Number
    },
    volume : {
        type : Number,
        default : null
    },
    volume_units : {
        type : Number
    },
    stock : {
        type : Number
    },
    pmp : {
        type : Number
    },
    fifo : {
        type : Number,
        default : null
    },
    lifo : {
        type : Number,
        default : null
    },
    fk_default_warehouse : {
        type : Number
    },
    finished : {
        type : Number
    },
    hidden : {
        type : Number
    },
    import_key : {
        type : Number,
        default : null
    },
    model_pdf : {
        type : Number,
        default : null
    },
    fk_price_expression : {
        type : Number,
        default : null
    },
    desiredstock : {
        type : Number,
        default : null
    },
    fk_unit : {
        type : Number,
        default : null
    },
    price_autogen : {
        type : Number
    },
    is_bundle : {
        type : Number,
        default : 0
    },
    status_active : {
        type : Number
    },
    stock_awal : {
        type : Number
    },
    date_adjustment : {
        type : Date
    },
    is_expired : {
        type : Number
    }
})

productCollection.index({
    rowid : 1,
    ref : 1,
},{
    unique : true
})

module.exports = mongoose.model('productCollection',productCollection,'product')