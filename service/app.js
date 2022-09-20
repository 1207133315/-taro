/*
还需安装的依赖
multer //处理上传功能
sqlite3 // 数据库
uuid // 很难重复的id生成
基础搭建
*/

const express = require("express") // 引入express
const multer = require("multer"); // 引入上传包
const app = express()
const port = 8080// 端口

// 跨域请求
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json())
// 指定上传的临时目录
const update = multer({
  dest: "./public/upload/temp"
})
app.use(update.any())// 允许所有接口可以上传
app.use("/test", require("./router/TestRouter"))

app.use("/admin", require("./router/AdminRouter"))

app.use("/category", require("./router/CategoryRouter"))




app.get("/", (req, res) => {
  res.send("Holle")
})

 app.listen(port,  () => {
  console.log(`启动成功:http://localhost:${port}`);
})
