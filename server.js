const Koa = require("koa");
const mongoose = require("mongoose");
const app = new Koa();

const bodyParser = require('koa-bodyparser')


//引入admin.js
const admin = require("./routes/api/admin");
//引入article.js
const article = require("./routes/api/article")

//DB config
const db = require("./config/keys").mongoURI;
//Connect to mongodb
mongoose.connect(db)
        .then(() => console.log("MongoDB connectd"))
        .catch((error) => console.log(err));

//使用koa-bodyparser的中间件
app.use(bodyParser())




//使用routes
app.use(admin.routes()).use(admin.allowedMethods());
app.use(article.routes()).use(article.allowedMethods());


const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})