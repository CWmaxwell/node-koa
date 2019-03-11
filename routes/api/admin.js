const Router = require('koa-router');
const router = new Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('koa-passport');
/**
 * @route GET api/admin/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async (ctx, next) => {
    ctx.body = 'admin works'
})

/**
 * $route  POST api/login
 * @desc   管理员登陆 返回token
 * @access public
 */
router.post("/", async (ctx, next) => {
    const { userName, password, type } = ctx.request.body;
    if(type === 'account' && userName === 'admin' && password === '123456'){
        ctx.response.status = 200;
        ctx.response.type = 'json';
        // 返回token
        const payload = { id: 0, name: 'admin' };
        const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
        ctx.body = { status: 'ok', type, currentAuthority: 'admin', token: 'Bearer ' + token };
    }else{
        ctx.response.status = 400;
        ctx.body = { error: '管理员账号或密码错误' };
    }
})
/**
 * @route GET api/login/adminUser
 * @desc 管理员信息接口地址  返回管理员信息
 * @access 接口是私密的
 */
router.get('/adminUser', passport.authenticate('jwt', { session: false }),async (ctx, next) => {
    const adminInfomation = {
        name: 'chenw247',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        userid: '0',
        email: '1515430697@qq.com',
        signature: '一步一个脚印前进',
        gourp: '暂无',
        tags: [
            {
                key: '0',
                label: '很有想法的',
            },
            {
                key: '1',
                label: '上手很快',
            },
        ],
        notifyCount: 0,
        unreadCount: 0,
        country: 'China',
        geographic: {
            province: {
                label: '广东省',
                key: '510000',
            },
            city: {
                label: '广州市',
                key: '512000',
            },
        },
        address: '番禺区中大大学慎思园6号',
        phone: '13719342427'
    }
    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.body = adminInfomation;
})

module.exports = router.routes();