const Router = require("koa-router");
const router = new Router();
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("koa-passport");
const Article = require("../../models/Article");
const Comment = require("../../models/Comment");
const Tag = require("../../models/Tag");
/**
 * @route GET api/admin/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async (ctx, next) => {
  ctx.body = "admin works";
});

/**
 * $route  POST api/admin/login
 * @desc   管理员登陆 返回token
 * @access public
 */
router.post("/login", async (ctx, next) => {
  const { userName, password, type } = ctx.request.body;
  if (type === "account" && userName === "admin" && password === "123456") {
    ctx.response.status = 200;
    ctx.response.type = "json";
    // 返回token
    const payload = { id: 0, name: "admin" };
    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
    ctx.body = {
      status: "ok",
      type,
      currentAuthority: "admin",
      token: "Bearer " + token
    };
  } else {
    ctx.response.status = 400;
    ctx.body = { error: "管理员账号或密码错误" };
  }
});
/**
 * @route GET api/admin/adminUser
 * @desc 管理员信息接口地址  返回管理员信息
 * @access private
 */
router.get(
  "/adminUser",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const adminInfomation = {
      name: "chenw247",
      avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
      userid: "0",
      email: "1515430697@qq.com",
      signature: "一步一个脚印前进",
      gourp: "暂无",
      tags: [
        {
          key: "0",
          label: "很有想法的"
        },
        {
          key: "1",
          label: "上手很快"
        }
      ],
      notifyCount: 0,
      unreadCount: 0,
      country: "China",
      geographic: {
        province: {
          label: "广东省",
          key: "510000"
        },
        city: {
          label: "广州市",
          key: "512000"
        }
      },
      address: "番禺区中大大学慎思园6号",
      phone: "13719342427"
    };
    ctx.response.status = 200;
    ctx.response.type = "json";
    ctx.body = adminInfomation;
  }
);

/**
 * $route  POST api/admin/article
 * @desc   post新文章上去
 * @access private
 */
router.post(
  "/article",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const body = ctx.request.body;
    const newArticle = new Article({
      title: body.title,
      author: body.author,
      content: body.content,
      tags: body.tag,
      numbers: body.content.length,
      category: body.category,
      state: body.state,
      numbers: body.content.length
    });
    /** 这里待测试，标签选择将自++ */
    body.tag.map((id, index) => {
      Tag.where({ _id: id }).update({ $inc: { articleCount: 1 } });
    });
    return newArticle
      .save()
      .then(article => {
        ctx.response.body = article;
      })
      .catch(err => {
        ctx.body = err;
      });
  }
);

/**
 * $route GET api/admin/article?searchKeyword=xxx&selectState=0\1\2
 * @desc 获取到管理员权限下的文章列表
 * @access private
 */
router.get(
  "/article",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    console.log(ctx.query);
    let { searchKeyword, selectState } = ctx.query;
    if (!selectState) selectState = 2;
    const reg = new RegExp(searchKeyword, "i"); //不区分大小写
    await Article.find({
      $or: [{ title: { $regex: reg } }, { keyword: { $regex: reg } }],
      state: { $lte: selectState }
    })
      .sort({ create_time: -1 })
      .populate({ path: "tags", model: Tag })
      .exec()
      .then(articles => {
        const articleList = articles.map((value, index) => ({
          key: value._id,
          title: value.title,
          desc: value.desc,
          author: value.author,
          keyword: value.keyword,
          state: value.state,
          tags: value.tags.map((tag, index) => tag.name),
          category: value.category,
          create_time: value.create_time,
          meta: value.meta
        }));
        ctx.response.type = "json";
        ctx.response.body = {
          code: 200,
          data: { list: articleList, count: articleList.length }
        };
      })
      .catch(err => {
        ctx.response.body = err;
      });
  }
);

/**
 * $route GET api/admin/articleDetail/:id
 * @desc 获取到管理员权限下的文章详情
 * @access private
 */
router.get(
  "/articleDetail/:id",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const id = ctx.params.id;
    await Article.findById(id)
      .populate({ path: "tags", model: Tag })
      .exec()
      .then(value => {
        const articleDetail = {
          key: value._id,
          title: value.title,
          desc: value.desc,
          author: value.author,
          keyword: value.keyword,
          state: value.state,
          numbers: value.numbers,
          tags: value.tags.map((tag, index) => tag.name),
          category: value.category,
          create_time: value.create_time,
          meta: value.meta,
          content: value.content
        };
        ctx.response.type = "json";
        ctx.response.body = {
          code: 200,
          data: articleDetail
        };
      })
      .catch(err => {
        ctx.response.body = err;
      });
  }
);

/**
 * $route POST api/admin/updatearticle/:id
 * @desc 更新某个文章
 * @access private
 */
router.post(
  "/updatearticle/:id",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const articleId = ctx.params.id;
    const body = ctx.request.body;
    const {
      title,
      author,
      desc,
      keyword,
      state,
      category,
      content,
      tag
    } = body;
    await Article.findByIdAndUpdate(
      articleId,
      { title, author, desc, keyword, state, category, content, tags: tag },
      { new: true }
    )
      .then(article => {
        ctx.response.body = article;
      })
      .catch(err => {
        ctx.body = err;
      });
  }
);

/**
 * $route DELETE api/admin/article?articleId=xxxxx
 * @desc 删除某个文章
 * @access private
 */
router.delete(
  "/article",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const { articleId } = ctx.query;
    // await Article.findByIdAndDelete(articleId, )

    const article = await Article.deleteOne({ _id: articleId });
    if (article.ok == 1) {
      await Comment.remove({ article_id: articleId }).then(() =>
        console.log("已删除文章评论")
      );
      // ctx.set("Content-Type", "application/json")
      ctx.response.type = "json";
      ctx.response.body = { code: 200, success: true };
    } else {
      ctx.status = 404;
      ctx.body = { error: "文章不存在" };
    }
  }
);

/**
 * $route GET api/admin/comment/article/:id
 * @desc 获取某文章下的全部评论
 * @access private
 */
router.get(
  "/comment/article/:id",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    await Comment.find({ article_id: ctx.params.id })
      .sort({ is_top: -1, create_time: 1 })
      .then(comments => {
        ctx.response.type = "json";
        ctx.response.body = {
          code: 200,
          data: { list: comments, count: comments.length }
        };
      });
  }
);

/**
 * $route POST api/admin/comment/top?commentId=xxxxxx
 * @desc 置顶某评论
 * @access private
 */
router.post(
  "/comment/top",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const { commentId } = ctx.query;
    console.log(commentId);
    const comment = await Comment.findById(commentId);
    console.log(comment);
    const value = comment.is_top;
    comment.is_top = !value;
    const commentUpdate = await Comment.findOneAndUpdate(
      { _id: commentId },
      { $set: comment },
      { new: true }
    );
    ctx.response.type = "json";
    ctx.response.body = { code: 200, data: commentUpdate };
  }
);

/**
 * $route POST api/admin/comment
 * @desc 管理员评论文章
 * @access private
 */
router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const body = ctx.request.body;
    const avatar = 'https://www.gravatar.com/avatar/a7fd9e4afc0aff417afededc15270312%3Fs=200&r=pg&d=mm';
    const user = {
        name: 'chenw247',
        email: '1515430697@qq.com',
        avatar,
        is_admin: true,
    }
    const newComment = new Comment({
        user,
        article_id: body.article_id,
        content: body.content,
        Reference: body.Reference,
    })
    await newComment.save().then(comment => {
        Article.findByIdAndUpdate(body.article_id, {$push:{comments: comment._id}, $inc:{"meta.comments": 1}}, {new: true}, function(err,docs) {
            if (err) console.log(err);
            // console.log('更改成功：' +docs);
        });
        ctx.response.type = "json";
        ctx.response.body = { code: 200, data: comment };
        // ctx.response.body = comment;
    })
    .catch(err => {ctx.body = err});
  }
);

/**
 * $route DELETE api/admin/comment?commentId=xxxxxx
 * @desc 删除某评论
 * @access private
 */
router.delete(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  async (ctx, next) => {
    const { commentId } = ctx.query;
    const comment1 = await Comment.findById(commentId);
    const article = await Article.findById(comment1.article_id);
    article.meta.comments -= 1;
    const index = article.comments.indexOf(commentId);
    article.comments.splice(index, 1);
    await Article.findOneAndUpdate({_id: comment1.article_id}, {$set: article}, {new: true});
    const comment = await Comment.deleteOne({ _id: commentId });
    if (comment.ok == 1) {
      // ctx.set("Content-Type", "application/json")
      ctx.response.type = "json";
      ctx.response.body = { code: 200, success: true };
    } else {
      ctx.status = 404;
      ctx.body = { error: "评论不存在" };
    }
  }
);

module.exports = router.routes();
