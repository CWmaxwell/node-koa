/**
 * Tag model module
 * @file 标签数据模型
 * @module model/Tag
 */

const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

// 标签模型
const TagSchema = new Schema({
    // 标签名称
    name: { type: String, required: true, validate: /\S+/ },

    // 该标签下的文章数目
    articleCount: { type: Number, default: 0 },

    // 发布日期
    create_time: { type: Date, default: Date.now },

    // 最后修改日期
    update_time: { type: Date, default: Date.now },
});

// 自增ID插件设置
TagSchema.plugin(autoIncrement.plugin, {
    model: 'tags',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

// 标签模型
module.exports = Tag = mongoose.model("tags", TagSchema);