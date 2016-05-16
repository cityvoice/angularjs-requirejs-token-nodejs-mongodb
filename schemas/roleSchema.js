'use strict'
var mongoose     = require('mongoose');
var db     = require('../conn');
var roleSchema   = new mongoose.Schema({
    roleId: Number,
    rights: Array,
    desc: String
});


roleSchema.statics.queryAll = function(callback) {
    return this.model('tb_roles').find({roleId:{$ne:1}}, callback);
}

var mongooseModel = db.model('tb_roles', roleSchema);
module.exports = mongooseModel;