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

// // Execution Cron

// // // Cron for Get Data

// var BukalapakCron = require('./modul/bukalapak/controller/BukalapakController')
// var TokopediaCron = require('./modul/tokopedia/controller/TokopediaController')
// var ShopeeCron = require('./modul/shopee/controller/shopeeController')
// var LazadaCron = require('./modul/lazada/controller/lazadaController')
// var JdidCron = require('./modul/jdid/controller/jdidController')
// var BlibliCron = require('./modul/blibli/controller/blibliController')
// var ZaloraCron = require('./modul/zalora/controller/zaloraController')
// var tiktokCron = require('./modul/tiktok/controller/tiktokController')

// // // Cron for Update Mechanism

// var BukalapakUpdateCron = require('./modul/bukalapak/controller/BukalapakUpdateController')
// var TokopediaUpdateCron = require('./modul/tokopedia/controller/TokopediaUpdateController')
// var ShopeeUpdateCron = require('./modul/shopee/controller/shopeeUpdateController')
// var LazadaUpdateCron = require('./modul/lazada/controller/lazadaUpdateController')
// var JdidUpdateCron = require('./modul/jdid/controller/jdidUpdateController')
// var BlibliUpdateCron = require('./modul/blibli/controller/blibliUpdateController')
// var ZaloraUpdateCron = require('./modul/zalora/controller/zaloraUpdateController')
// var tiktokUpdateCron = require('./modul/tiktok/controller/tiktokUpdateController')

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