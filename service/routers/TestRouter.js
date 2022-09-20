const express = require("express")
const {db, genid} = require("../db/DBUtils");
const router = express.Router()

// async代表这个函数是异步执行的
router.get("/test", async (req, res) => {

  // db.all("select * from `admin`", [], (err, rows) => {
  //   console.log(rows)
  // })
  // db.async.all("select * from `admin`", []).then((res) => {
  //   console.log(res)
  // })

  // 同步 等待执行
  let out= await db.async.all("select * from `admin`", [])
  res.send({
    id: genid.NextId(),
    out// 相当于out:out
  })
})

module.exports = router
