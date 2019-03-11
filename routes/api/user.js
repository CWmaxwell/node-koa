const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const User = require("../../models/User");

// /**
//  * $route POST api/user/login
//  * @desc 返回用户注册信息
//  * @access public
//  */
// router.post("/login", async (ctx, next) => {
    // const body = ctx.request.body;
    // const avatar = gravatar.url(body.email, {s:'200',r:'pg',d:'mm'});
    // const newUser = new User({
    //     name: body.name,
    //     email: body.email,
    //     avatar,
    // })
    // return 
// })