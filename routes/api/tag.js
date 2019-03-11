const Router = require('koa-router');
const router = new Router();
const Tag = require("../../models/Tag");
const passport = require('koa-passport');
/**
 * $route  GET api/tag/test
 * @desc   标签路由测试
 * @access public
 */ 
router.get("/test", async (ctx, next) => {
    ctx.body = 'Tag code works'
})

/**
 * $route  POST api/tag
 * @desc   post新标签上去
 * @access private
 */
router.post("/", passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    const newTag = new Tag({
        name: ctx.request.body.name,
    })
    await newTag.save().then(tag => {
            ctx.response.type = 'json';
            ctx.response.body = { code: 200, data: tag };
        })
        .catch(err => {ctx.response.body = err})
})

/**
 * $route  GET api/tag
 * @desc   获取标签列表
 * @access public
 */
router.get("/", async (ctx, next) => {
    // ctx.response.type = 'json';
    // ctx.response.body = {data: 'ceshi'};
    await Tag.find()
       .sort({create_time: -1})
       .then(tags => {
           // ctx.set("Content-Type", "application/json")
           ctx.response.type = 'json';
           ctx.response.body = { code: 200, data: { list: tags, count: tags.length}};
       })
       .catch(err => {ctx.response.body = err})
})

/**
 * $route GET api/tag/:id
 * @desc 获取标签Id对应的name
 * @access public
 */
router.get("/:id", async (ctx, next) => {
    await Tag.findById(ctx.params.id)
            .then(tag => {
                ctx.response.type='json';
                ctx.body = { code: 200, data: tag.name }
            })
            .catch(err => {ctx.response.body = err})
})

/**
 * $route DELETE api/tag?tag_id=number
 * @desc  删除某个标签
 * @access 接口是私有的
 */ 
router.delete("/", async (ctx, next) => {
    // 拿到id
    const tag_id = ctx.query.tag_id;
    // 查询
    // const tag = await Tag.find({ _id: tag_id });
    const tag = await Tag.deleteOne({ id: tag_id });

    if (tag.ok == 1) {
        // ctx.set("Content-Type", "application/json")
        ctx.response.type = 'json';
        ctx.response.body = { code: 200, success: true};
    } else {
        ctx.status = 404;
        ctx.body = { error: 'tag不存在' };
    }
})

module.exports = router.routes();