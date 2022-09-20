const express = require("express")
const {db, genid} = require("../db/DBUtils");
const {v4: uuidv4} = require("uuid")
const fs = require("fs")
const router = express.Router()


router.post("/upload", async (req, res) => {
  if (!req.files) {
    res.send({
      "errno": 1, // 只要不等于 0 就行
      "message": "失败信息"
    })
  } else {
    let files = req.files
    let ret_files = []
    for (let file of files) {
      // 获取文件后缀
      let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
      // 随机文件名字
      let file_name = genid.NextId() + "." + file_ext
      // 修改名字和移动文件
      fs.renameSync(
        process.cwd() + "/public/upload/temp/" + file.filename,
        process.cwd() + "/public/upload/" + file_name
      )
      ret_files.push("/upload/" + file_name)
    }
    res.send({
      "errno": 0, // 注意：值是数字，不能是字符串
      "data": {
        "url": ret_files, // 图片 src ，必须
      }
    })
  }
})

module.exports = router
