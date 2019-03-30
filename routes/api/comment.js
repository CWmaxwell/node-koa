const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const Comment = require("../../models/Comment");
const Article = require("../../models/Article");

/**
 * #route POST api/comment/userupdate
 * @desc 更改用户信息（目前主要是用于更改用户头像）
 * @access public 
 */
router.post('/userupdate', async (ctx, next) => {
    const body = ctx.request.body;
    const avatar = gravatar.url(body.email, {s:'200',r:'pg',d:'mm'});
    const user = {
        name: body.name,
        email: body.email,
        avatar,
    }
    ctx.response.body = user;
})

/**
 * $route POST api/comment
 * @desc 评论某文章
 * @access public
 */
router.post('/', async (ctx, next) => {
    const body = ctx.request.body;
    const avatar = gravatar.url(body.email, {s:'200',r:'pg',d:'mm'});
    const user = {
        name: body.name,
        email: body.email,
        avatar,
    }
    const newComment = new Comment({
        user,
        article_id: body.article_id,
        content: body.content,
        Reference: body.Reference,
    })
    await newComment.save().then(comment => {
        console.log(comment._id);
        Article.findByIdAndUpdate(body.article_id, {$push:{comments: comment._id}, $inc:{"meta.comments": 1}}, {new: true}, function(err,docs) {
            if (err) console.log(err);
            // console.log('更改成功：' +docs);
        });
        ctx.response.body = comment;
    })
    .catch(err => {ctx.body = err});
})

/**
 * $route GET api/comment/article/:id
 * @desc 获取某文章下的全部评论
 * @access public
 */
router.get('/article/:id', async (ctx, next) => {
    await Comment.find({article_id: ctx.params.id})
                .sort({create_time: 1})
                .then(comments => {
                    ctx.response.type = 'json';
                    ctx.response.body = { code: 200, data: { list: comments, count: comments.length}};
                })
})

/**
 * $route POST api/comment/like/:id
 * @desc 点赞某文章
 * @access public
 */
router.post('/like/:id', async (ctx, next) => {
    const body = ctx.request.body;
    ctx.response.type = 'json';
    const comment = await Comment.findById(ctx.params.id);
    if (comment) {
        if (comment.likes.indexOf(body.email) !== -1) {
            ctx.status = 400;
            ctx.body = { alreadyLiked: '该用户已赞过'};
            return;
        }
        comment.likes.unshift(body.email);
        const commentUpdate = await Comment.findOneAndUpdate({_id: ctx.params.id}, {$set: comment}, {new: true});
        ctx.body = {code: 200, data: commentUpdate};
    } else {
        ctx.status = 404;
        ctx.body = { error: 'article不存在'};
    }
})

module.exports = router.routes();