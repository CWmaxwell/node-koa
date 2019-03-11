/**
 * Comment model module.
 * @file 评论数据模型
 * @module model/Comment
 */

const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    // 评论所在的文章 id
    article_id: { type: mongoose.Schema.Types.ObjectId, required: true },

    // 用户
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: true },
    },
    
    // 评论内容
    content: { type: String, required: true, validate: /\S+/ },

    // 是否置顶
    is_top: { type: Boolean, default: false },

    // 被赞数
    likes: [
        {
            email: { type: String }
        }
    ],

    // 引用的回复
    Reference: { 
        author: { type: String },
        content: { type: String, validate: /\S+/ },
    },

    // 状态 => 0：待审核，1：正常通过，-1：已删除，-2：垃圾评论
    state: { type: Number, default: 1 },

    // 该评论是否已经处理过 => 1是/2否
    is_handle: { type: Number, default: 2 },

    // 创建日期
    create_time: { type: Date, default: Date.now },

    // 最后修改日期
    update_time: { type: Date, default: Date.now },

});

// 自增ID插件配置
CommentSchema.plugin(autoIncrement.plugin, {
    model: 'comments',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

// 评论模型
module.exports = Comment = mongoose.model('comments', CommentSchema);