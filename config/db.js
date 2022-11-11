var mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/work2');
mongoose.connect('mongodb://127.0.0.1:3001/meteor');
// mongoose.connect('mongodb://egogoIt:3g0g0It@mongod0.egogohub.tech:27017/egogo?authSource=admin');

mongoose.connection.on('connected', function() {
    console.log('Connected to Mongo DB');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

//testing