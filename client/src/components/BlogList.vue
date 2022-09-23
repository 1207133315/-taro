<template>
  <div v-for="(item,index) in blogListInfo" style="margin: 15px">
    <n-card :title="item.title" @click="toDetail(item)" style="margin-bottom: 15px;cursor: pointer" >
      {{ item.content }}
      <template #footer>
        <n-space align="center">
          <div>发布时间:{{ item.create_time }}</div>
          <n-button @click.stop="updateClick(item)" v-if="isShow">修改</n-button><!--.stop是防止事件冒泡,也就是点击子元素的时候不会执行父元素的点击事件-->
          <n-button @click="deleteItem(item)" v-if="isShow">删除</n-button>
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {inject, onMounted, reactive, ref} from "vue";
import axios from "axios";
import router from "../common/router.ts";
import RouterConstants from "../common/RouterConstants.ts";

const message = inject("message");
const dialog = inject("dialog");

const blogListInfo = ref([])

const isShow=ref(true)

const pageInfo = reactive({
  page: 1,// 页数
  pageSize: 3,// 一页多少数据
  pageCount: 0,// 总共有多少页
  count: 0,// 总共有多少数据
  keyword:"",
  categoryId:0
})

onMounted(() => {
  loadBlogs()
})

const hideButton=()=>{
  isShow.value=false
}
// 给父组件传值用
const emit = defineEmits(["getPageInfo", "updateClick"])
// 提供给父组件调用的方法
const setPage = (pageNum) => {
  console.log('子组件接收到值:' + pageNum)
  pageInfo.page = pageNum
  loadBlogs()
}

const loadBlogs = async () => {
  const res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&keyword=${pageInfo.keyword}&categoryId=${pageInfo.categoryId}`)
  let rows = res.data.data.rows
  for (let row of rows) {
    if (row.content.length > 50) {
      row.content = row.content.substr(0, 50) + "..."
    }
    const date = new Date(row.create_time);
    row.create_time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  const count = res.data.data.count
  pageInfo.count = count
  // 计算可以分成几页 Math.floor向下取整
  pageInfo.pageCount = Math.floor(count / pageInfo.pageSize) + (count % pageInfo.pageSize > 0 ? 1 : 0)
  blogListInfo.value = rows
  //emit(":value",pageInfo)
  // 把值传给父控件
  emit("getPageInfo", pageInfo)
}

const updateClick = (item) => {
  emit("updateClick", item)
}
const deleteItem = async (item) => {
   dialog.warning({
    title: '提示',
    content: `你确定删除'<'${item.title}'>'这篇文章吗`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      axios.delete("/blog/delete?id=" + item.id).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          message.success(res.data.msg)
          loadBlogs()
        } else {
          message.error(res.data.msg)
        }
      })

    }
  })

}

const toDetail=(item)=>{
    router.push({
      path:RouterConstants.detailPath,
      query:{id:item.id}
    })
}

// 向父组件暴漏方法  想要给父组件暴漏哪个方法都可以
defineExpose({setPage, loadBlogs,hideButton})
</script>

<style scoped>

</style>
