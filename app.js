var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cron = require('node-cron');
var con = require('./config/db')

// var AppRouter = require('./modul/index')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', AppRouter)

// Execution Cron

// // Cron for Get Data

var BukalapakCron = require('./modul/bukalapak/controller/BukalapakController')
var TokopediaCron = require('./modul/tokopedia/controller/TokopediaController')
var ShopeeCron = require('./modul/shopee/controller/shopeeController')
var LazadaCron = require('./modul/lazada/controller/lazadaController')
var JdidCron = require('./modul/jdid/controller/jdidController')
var BlibliCron = require('./modul/blibli/controller/blibliController')
var ZaloraCron = require('./modul/zalora/controller/zaloraController')
var tiktokCron = require('./modul/tiktok/controller/tiktokController')

// // Cron for Update Mechanism

var BukalapakUpdateCron = require('./modul/bukalapak/controller/BukalapakUpdateController')
var TokopediaUpdateCron = require('./modul/tokopedia/controller/TokopediaUpdateController')
var ShopeeUpdateCron = require('./modul/shopee/controller/shopeeUpdateController')
var LazadaUpdateCron = require('./modul/lazada/controller/lazadaUpdateController')
var JdidUpdateCron = require('./modul/jdid/controller/jdidUpdateController')
var BlibliUpdateCron = require('./modul/blibli/controller/blibliUpdateController')
var ZaloraUpdateCron = require('./modul/zalora/controller/zaloraUpdateController')
var tiktokUpdateCron = require('./modul/tiktok/controller/tiktokUpdateController')

// // // Update Upload Local Server
// // let updateOrderCron = require('./modul/updateOrder/controller/updateControllers')
// let updateCompletedAt = require("./modul/updateOrder/controller/updateCompletedAt")

// Cron 1 Local Server
let Bukalapak1Cron = require("./modul/bukalapak/controller/bukalapak1Controller");
let Tokopedia1Cron = require("./modul/tokopedia/controller/tokopedia1Controller");
let shopee1Cron = require("./modul/shopee/controller/shopee1Controller");
let lazada1Cron = require("./modul/lazada/controller/lazada1Controller");
let blibli1Cron = require("./modul/blibli/controller/blibli1Controller");
let zalora1Cron = require("./modul/zalora/controller/zalora1Controller")

// Cron 2 Local Server
let Bukalapak2Cron = require("./modul/bukalapak/controller/bukalapak2Controller");
let Tokopedia2Cron = require("./modul/tokopedia/controller/tokopedia2Controller");
let shopee2Cron = require("./modul/shopee/controller/shopee2Controller");
let lazada2Cron = require("./modul/lazada/controller/lazada2Controller");
let blibli2Cron = require("./modul/blibli/controller/blibli2Controller");
let zalora2Cron = require("./modul/zalora/controller/zalora2Controller")

// // catch 404 and forward to error handler

app.use(function(req, res, next) {
    next(createError(404));
});


app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;