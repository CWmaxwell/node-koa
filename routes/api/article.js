const Router = require('koa-router');
const router = new Router();
const Article = require("../../models/Article");
const Tag = require("../../models/Tag");
/**
 * $route GET api/article
 * @desc 获取首页文章页面
 * @access public
 */
router.get("/", async (ctx, next) => {
    await Article.find({ state: 1 })
        .sort({ create_time: -1 })
        .then(articles => {
            const articleList = articles.map((value, index) => ({
                id: value._id,
                title: value.title,
                desc: value.desc,
                author: value.author,
                keyword: value.keyword,
                create_time: value.create_time,
                meta: value.meta,
            }))
            ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
        })
        .catch(err => {ctx.response.body = err});
});


/**
 * $route  GET api/article/code
 * @desc   获取代码文章页面
 * @access public
 */
router.get("/code", async (ctx, next) => {
    await Article.find({ state: 1, category: 1 })
       .sort({create_time: -1})
       .then(articles => {
           const articleList = articles.map((value, index) => ({
                id: value._id,
                title: value.title,
                desc: value.desc,
                author: value.author,
                keyword: value.keyword,
                create_time: value.create_time,
                meta: value.meta,
           }))
           ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
       })
       .catch(err => {ctx.response.body = err});
});

/**
 * $route  GET api/article/game
 * @desc   获取游戏文章页面
 * @access public
 */
router.get("/game", async (ctx, next) => {
    await Article.find({ state: 1, category: 2 })
       .sort({create_time: -1})
       .then(articles => {
           const articleList = articles.map((value, index) => ({
                id: value._id,
                title: value.title,
                desc: value.desc,
                author: value.author,
                keyword: value.keyword,
                create_time: value.create_time,
                meta: value.meta,
           }))
           ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
       })
       .catch(err => {ctx.response.body = err});
});

/**
 * $route  GET api/article/other
 * @desc   获取日常文章页面
 * @access public
 */
router.get("/other", async (ctx, next) => {
    await Article.find({ state: 1, category: 3 })
       .sort({create_time: -1})
       .then(articles => {
           const articleList = articles.map((value, index) => ({
                id: value._id,
                title: value.title,
                desc: value.desc,
                author: value.author,
                keyword: value.keyword,
                create_time: value.create_time,
                meta: value.meta,
           }))
           ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
       })
       .catch(err => {ctx.response.body = err});
});

/**
 * $route GET api/article/search/:keyword
 * @desc 搜索包含关键词的文章
 * @access public
 */
router.get("/search/:keyword", async (ctx, next) => {
    const reg = new RegExp(ctx.params.keyword, 'i') //不区分大小写
    await Article.find({$or:[{title : {$regex : reg}}]})
        .sort({create_time: -1})
        .then(articles => {
            const articleList = articles.map((value, index) => ({
                    id: value._id,
                    title: value.title,
                    desc: value.desc,
                    author: value.author,
                    keyword: value.keyword,
                    create_time: value.create_time,
                    meta: value.meta,
            }))
            ctx.response.type = 'json';
            ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
        })
        .catch(err => {ctx.response.body = err});
})

/**
 * $route GET api/article/tag/:id
 * @desc 获取某个标签下的文章列表
 * @access public
 */
router.get("/tag/:id", async (ctx, next) => {
    await Article.where("tags").in([ctx.params.id])
                 .sort({create_time: -1})
                 .then(articles => {
                    const articleList = articles.map((value, index) => ({
                        id: value._id,
                        title: value.title,
                        desc: value.desc,
                        author: value.author,
                        keyword: value.keyword,
                        create_time: value.create_time,
                        meta: value.meta,
                    }))
                    ctx.response.type = 'json';
                    ctx.response.body = { code: 200, data: { list: articleList, count: articleList.length}};
                })
                .catch(err => {ctx.response.body = err});
})

/**
 * $route POST api/article/like/:id
 * @desc 文章点赞
 * @access public 
 */
router.post("/like/:id", async (ctx, next) => {
    const body = ctx.request.body;
    ctx.response.type = 'json';
    const article = await Article.findById(ctx.params.id);
    if (article) {
        if (article.likes.indexOf(body.email) !== -1) {
            ctx.status = 400;
            ctx.body = { alreadyLiked: '该用户已赞过'};
            return;
        }
        article.likes.unshift(body.email);
        article.meta.likes = article.likes.length;
        const articleUpdate = await Article.findOneAndUpdate({_id: ctx.params.id}, {$set: article}, {new: true});
        ctx.body = {code: 200, data: articleUpdate};
    } else {
        ctx.status = 404;
        ctx.body = { error: 'article不存在'};
    }
   
})

/**
 * $route  GET api/article/:id
 * @desc   获取单个文章详情
 * @access public
 */
router.get("/:id", async (ctx, next) => {
    // let article;
    await Article.findByIdAndUpdate(ctx.params.id, {$inc:{"meta.views":1}}, {new: true})
            .populate({path: 'tags', model:Tag})
            .exec()
            .then(article => {
                ctx.response.type = 'json';
                ctx.body = { code: 200, data: article};
           })
           .catch(err => ctx.body = err);
    // await Article.findById(ctx.params.id)
    //        .populate({path: 'tags', model: Tag})
    //        .exec()
    //        .then(article => {
    //             ctx.response.type = 'json';
    //             ctx.body = { code: 200, data: article};
    //        })
    //        .catch(err => ctx.body = err);
});

/**
 * $route  GET api/article/test
 * @desc 获取文章列表(测试用)
 * @access public
 */
router.get("/test/1", async (ctx, next) => {
    await Article.find()
       .sort({create_time: -1})
       .then(articles => {
           // ctx.set("Content-Type", "application/json")
           ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: articles, count: articles.length}};
       })
       .catch(err => {ctx.response.body = err});
});




module.exports = router.routes();