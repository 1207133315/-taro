const express = require("express")
const {db, genid} = require("../db/DBUtils");
const {v4: uuidv4} = require("uuid")
const router = express.Router()

// 查询单个文章
router.get("/getBlogById", async (req, res) => {
  let {id} = req.query
  const sql = "select * from `blog` where `id`=?"
  let {err, rows} = await db.async.all(sql, [id])
  if (err == null && rows.length > 0) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: rows[0]
    })
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
      date: []
    })
  }
})

// 添加博客
router.post("/add", async (req, res) => {
  let {title, categoryId, content} = req.body
  let id = genid.NextId()
  let createTime = new Date().getTime()
  const insertSql = "insert into `blog` (`id`,`title`,`category_id`,`content`,`create_time`) values (?,?,?,?,?)"
  let {err, rows} = await db.async.run(insertSql, [id, title, categoryId, content, createTime])
  if (err == null) {
    res.send({
      code: 200,
      msg: '添加成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '添加失败'
    })
  }
})
// 修改博客
router.put("/update", async (req, res) => {
  let {id, title, categoryId, content} = req.body
  let createTime = new Date().getTime()
  const updateSql = "update `blog` set `title`=?,`content`=?,`category_id`=? where `id`=?"
  let {err, rows} = await db.async.run(updateSql, [title, content, categoryId, id])
  if (err == null) {
    res.send({
      code: 200,
      msg: '修改成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '修改失败'
    })
  }
})
// 删除博客
router.delete("/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE from `blog` WHERE `id`=?"
  let {err, rows} = await db.async.run(delete_sql, [id])
  if (err == null) {
    res.send({
      code: 200,
      msg: '删除成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '删除失败'
    })
  }
})

// 查询博客
router.get("/search", async (req, res) => {
  /*
  keyword 关键字 模糊查询
  categoryId 分类编号
  分页:page,count
  */
  let {keyword, categoryId, page, pageSize} = req.query
  page = page == null ? 1 : page //默认第一页
  pageSize = pageSize == null ? 10 : pageSize // 默认十条
  categoryId = categoryId == null ? 0 : categoryId
  keyword = keyword == null ? "" : keyword
  let params = []
  let whereSqls = []
  if (categoryId != 0) {
    whereSqls.push(" `category_id` = ? ")
    params.push(categoryId)
  }
  if (keyword != "") {
    whereSqls.push("( `title` like ? or `content` like ?) ")
    params.push("%" + keyword + "%")
    params.push("%" + keyword + "%")// 要push两遍  因为有title和countent两个字段
  }
  let whereSqlStr = ""
  if (whereSqls.length > 0) {
    whereSqlStr = "where" + whereSqls.join("and")
  }
  let searchSql = "select * from `blog` " + whereSqlStr + "order by `create_time` desc limit ?,?"
  // 假设前端传的page=1 size=10  则(page-1)*count=0
  // 从第0条开始 查询十条
  // page=2  count=10  (page-1)*count=10  从第10条开始 查询十条
  let searchParams = params.concat([(page - 1) * pageSize, pageSize])

  // 查询数据总数
  let searchCountSql = "select count(*) as count from `blog`" + whereSqlStr
  let searchCountParams = params


  let searchResult = await db.async.all(searchSql, searchParams)
  let countResult = await db.async.all(searchCountSql, searchCountParams)

  console.log('searchSql:' + searchSql)
  console.log('searchCountSql:' + searchCountSql)

  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        count: countResult.rows[0].count,
        rows: searchResult.rows
      }
    })
  } else {
    res.send({
      code: 200,
      msg: "查询失败"
    })
  }

})

module.exports = router
