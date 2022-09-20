const express = require("express")
const {db} = require("../db/DBUtils");
const {v4: uuidv4} = require("uuid")
const router = express.Router()
router.post("/login", async (req, res) => {
  let {account, password} = req.body// 接收传过来的账号和密码
  // 根据用户密码查询用户信息
  let {err, rows} = await db.async.all("select * from `admin` where `account`=? AND `password`=?", [account, password])
  // 如果查询到了则代表登录成功
  if (err == null && rows.length > 0) {
    let token = uuidv4()// 生成token
    let admin_info = rows[0];// 获取到信息
    let update_token_sql = "UPDATE `admin` SET `token`=? where `id`=?"
    await db.async.run(update_token_sql, [token, admin_info.id])// 把token写入到数据库
    admin_info.token = token
    admin_info.password = ""
    // 返回
    res.send({
      code: 200,
      msg: '登录成功',
      data: admin_info
    })
  } else {
    res.send({
      code: 500,
      msg: '登录失败'
    })
  }
})

module.exports = router
