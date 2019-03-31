const Koa = require("koa");
const mongoose = require("mongoose");
const cors = require("koa-cors");
const logger = require("koa-logger");
const passport = require("koa-passport");
const app = new Koa();

const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const router = new Router();
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
// 引入admin.js
const admin = require("./routes/api/admin");
// 引入article.js
const article = require("./routes/api/article");
// 引入tag.js
const tag = require("./routes/api/tag");
// 引入comment.js
const comment = require("./routes/api/comment");

// DB config
// const db = require("./config/keys").mongoURI;

const db = `mongodb://127.0.0.1:'27017'/boke`;

// Connect to mongodb
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connectd"))
  .catch(error => console.log(err));

// 打印访问信息
app.use(logger());

// json pretty
//app.use(json());

// 允许跨域
app.use(cors());

// 使用koa-bodyparser的中间件
app.use(bodyParser());

app.use(passport.initialize());
app.use(passport.session());

// 回调到config文件中 passport.js
require("./config/passport")(passport);

// 配置路由地址
router.use("/api/article", article);
router.use("/api/admin", admin);
router.use("/api/tag", tag);
router.use("/api/comment", comment);
// 配置路由
app.use(router.routes()).use(router.allowedMethods());
//使用routes
// app.use(admin.routes()).use(admin.allowedMethods());
// app.use(article.routes()).use(article.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
