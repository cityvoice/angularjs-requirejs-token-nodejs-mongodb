'use strict'
var mongoose     = require('mongoose');
var db     = require('../conn');
var userSchema   = new mongoose.Schema({
    loginName: String,
    realName: String,
    password: String,
    role: Number,
    token: String
});
// 添加 mongoose 实例方法
// userSchema.methods.findByUserName = function(username, callback) {
//     return this.model('brief').find({loginName: username}, callback);
// }

// 添加 mongoose 静态方法
userSchema.statics.findUser = function(user, callback) {
    return this.model('tb_userinfos').findOne({loginName: user.loginName, password:user.password}, callback);
}
//exclude admins
userSchema.statics.queryAll = function(callback) {
    return this.model('tb_userinfos').find({role:{$ne:1}}, callback);
}
//Notice:Don't recommend!
userSchema.statics.page = function(cp, ps, callback) {
    return this.model('tb_userinfos').find({role:{$ne:1}},callback).sort({_id:1}).skip(cp).limit(ps);
}
//Notice:Don't recommend!
userSchema.statics.isAdmin = function(_id, callback) {
    return this.model('tb_userinfos').findOne({_id: _id, role:1},callback);
}

var mongooseModel = db.model('tb_userinfos', userSchema);
module.exports = mongooseModel;