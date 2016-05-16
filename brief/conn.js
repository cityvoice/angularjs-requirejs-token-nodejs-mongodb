
var mongoose     = require('mongoose');
var dbconfig = require('./dbconfig');
var db = mongoose.createConnection('mongodb://'+dbconfig.host+':27017/'+dbconfig.db);
db.on('error', function(error) {
    console.log(error);
});
module.exports = db;