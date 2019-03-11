/**
 * User model module
 * @file 用户数据模型
 * @module model/User
 */

const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

// 用户模型
const UserSchema = new Schema({
    // 用户名称
    name: { type: String, required: true },

    // 用户邮箱
    email: { type: String, required: true },

    // 用户头像
    avatar: { type: String },

    // 用户创建日期
    create_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
UserSchema.plugin(autoIncrement.plugin, {
    model: 'users',
    filed: 'id',
    startAt: 1,
    incrementBy: 1,
});

module.exports = User = mongoose.model('users', UserSchema);