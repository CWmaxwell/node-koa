const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const Comment = require("../../models/Comment");
const Article = require("../../models/Article");
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
        Article.findByIdAndUpdate(body.article_id, {$push:{comments: comment._id}}, function(err,docs) {
            if (err) console.log(err);
            console.log('更改成功：' +docs);
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

module.exports = router.routes();