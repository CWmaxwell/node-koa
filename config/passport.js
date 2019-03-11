const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require('mongoose');
const User = require('../models/User');
module.exports = passport => {
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        if (jwt_payload.id === 0) {
            return done(null, true);
        }
        // 处理普通用户登录的情况 
        // const user = await User.findById(jwt_payload.id);
        // if (user) {
        //     return done(null, user);
        // } else {
        //     return done(null, false);
        // }
    }))
}