const Router = require('koa-router');
const router = new Router();
const Article = require("../../models/Article")

// $route  GET /code
// @desc   获取代码文章页面
// @access public
router.get("/code", async (ctx, next) => {
    ctx.body = 'code works'
})

// $route  GET /article/:id
// @desc   获取单个文章详情
// @access public
router.get("/article/:id", async (ctx, next) => {
    return Article.findById(ctx.params.id)
        .then(article => ctx.body = article)
        .catch(err => ctx.body = err)
})

// $route  POST /article
// @desc   post新文章上去
// @access private
router.post("/article", async (ctx, next) => {
    const newArticle = new Article({
        title: ctx.request.body.title,
        text: ctx.request.body.text
    })
    return newArticle.save().then(article => {
            ctx.response.body = article
        })
        .catch(err => {ctx.body = err})
})

module.exports = router;