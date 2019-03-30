/**
 * Article model module
 * @file 文章数据模型
 * @module model/Article
 */

const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//Create Schema
const ArticleSchema = new Schema({
    // 文章标题
    title: { type:String, required: true, validate: /\S+/ },
    
    // 文章关键字（SEO）
    keyword: [{ type: String, default: '' }],

    // 作者
    author: { type: String, required: true, validate: /\S+/ },

    // 文章描述
    desc: { type: String, default: '' },

    // 文章内容
    content: { type: String, required: true, validate: /\S+/ },

    // 字数
    numbers: { type: String, default: 0 },

    // 文章类型 => 1：普通文章，2：简历，3：管理员介绍（关于）
    type: { type: Number, default: 1 },

    // 文章发布状态 => 0：草稿，1：已发布
    state: { type: Number, default: 1 },

    // 文章标签
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags', required: true }],

    // 文章分类 => 1:码农，2：游戏，3：日常
    category: { type: Number, default: 1},

    // 文章评论
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments', required: true }],

    // 点赞的用户,只存储email
    likes:[
        {
            type: String,
            required: true
        }
    ],

    // 其他元信息
    meta: {
        views: { type: Number, default: 0},
        likes: { type: Number, default: 0},
        comments: { type: Number, default: 0},
    },
    // 创建日期
    create_time: { type:Date, default: Date.now },
    // 最后修改日期
    update_time: { type:Date, default: Date.now },
})

module.exports = Article = mongoose.model("articles", ArticleSchema);

// autoIncrement.initialize(mongoose.connection);
// 自增ID插件配置
ArticleSchema.plugin(autoIncrement.plugin, {
    model: 'articles',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});