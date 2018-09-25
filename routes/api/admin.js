const Router = require('koa-router');
const router = new Router();

router.get("/test", async (ctx, next) => {
    ctx.body = 'admin works'
})

// $route  POST /admin
// @desc   管理员登陆
// @access public

router.post("/admin", async (ctx, next) => {
    const { admin, password } = ctx.request.body;
    if(admin === 'admin' && password === '123456'){
        ctx.body = 'admin login success!'
    }else{
        ctx.body = 'failed!'
    }
})

module.exports = router;