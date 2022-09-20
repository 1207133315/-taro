/*
还需安装的依赖
multer //处理上传功能
sqlite3 // 数据库
uuid // 很难重复的id生成
基础搭建
*/

const express = require("express") // 引入express
const multer = require("multer");
const path = require("path");
const {db} = require("./db/DBUtils"); // 引入上传包
const app = express()
const port = 8080// 端口

// 跨域请求
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json())
// 指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))

// 指定上传的临时目录
const update = multer({
  dest: "./public/upload/temp"
})
app.use(update.any())// 允许所有接口可以上传

// 所有接口设置一个中间件
const ADMIN_TOKEN_PATH = "/token"
app.all("*", async (req, res, next) => {
  // 如果接口请求时的路径包含token 则进行token的验证
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    // token校验
    let token = req.headers.token
    let admin_token_sql = "select *from `admin` where `token`=?"
    let adminResult = await db.async.all(admin_token_sql, token)
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: "请先登录"
      })
      return
    }else {
      next()
    }
  }else {
    next()
  }
})

app.use("/test", require("./routers/TestRouter"))

app.use("/admin", require("./routers/AdminRouter"))

app.use("/category/token", require("./routers/CategoryRouter"))
app.use("/category", require("./routers/CategoryRouter"))

app.use("/blog", require("./routers/BlogRouter"))

app.use("/upload", require("./routers/UploadRouter"))


app.get("/", (req, res) => {
  res.send("Holle")
})

app.listen(port, () => {
  console.log(`启动成功:http://localhost:${port}`);
})
