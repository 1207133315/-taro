<template>
  <!--    tab
  default-value 默认显示哪个tab
  justify-content 排列方式 evenly 均匀排列
  type 类型

  -->
  <n-tabs v-model:value="tabValue" justify-content="space-evenly" type="line">
    <n-tab-pane name="list" tab="文章列表">
      <blog-list @getPageInfo="getPageInfo" @updateClick="update" ref="child"></blog-list>
      <n-space>
        <div class="pageCount" @click="toPage(pageNum)" v-for="pageNum in mPageInfo.pageCount">
          <div  :style="{'color':pageNum==mPageInfo.page?'red':'blue'}">
            {{ pageNum }}
          </div>
        </div>
      </n-space>
    </n-tab-pane>

    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" placeholder="请选择分类"/>
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor @updateValue="changeAddArticle" ref="child"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="commit">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>

    <n-tab-pane name="update" tab="修改文章">

      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="updateArticle.title" placeholder="请输入标题"/>
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" placeholder="请选择分类"/>
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor @updateValue="changeUpdateArticle" ref="child"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="updateCommit">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import {AdminStore} from "../../stores/AdminStore.js";
const adminStore = AdminStore()
import {useRouter, useRoute} from "vue-router";
import {ref, reactive, inject, onMounted} from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue"
import BlogList from "../../components/BlogList.vue"
import "../detail/less/Article.less"
const thisRouter = useRouter()
const route = useRoute()
const axios = inject("axios")
const message = inject("message");
const dialog = inject("dialog");
const child = ref()
const richChild = ref({})
let addArticle = ref({
  categoryId: '',
  title: "",
  content: ""
})
let updateArticle = ref({
  id: 0,
  categoryId: '',
  title: "",
  content: ""
})
const categoryOptions = ref([])

onMounted(() => {
  loadCategorys()
})


const loadCategorys = async () => {
  let res = await axios.get("/category/token/list")
  if (res.data.code != 200) {
    message.error(res.data.msg)
    return
  }
  categoryOptions.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
}

const commit = async () => {
  let res = await axios.post("/blog/add", addArticle.value)
  console.log("添加数据" + res)
  if (res.data.code == 200) {
    message.success("提交成功")
    addArticle.value.title = ""
    addArticle.value.content = ""
    addArticle.value.categoryId = ''
    child.value.setValueHtml(addArticle.value.content)
    tabValue.value="list"
  } else {
    message.error(res.data.msg)
  }
}


// 接收blogList传过来的数据
let mPageInfo = ref({});

// 接收子组件传递过来的数据
let getPageInfo = (pageInfo) => {
  console.log('接收到值' + pageInfo.pageCount)
  mPageInfo.value = pageInfo
}

// 接收添加文章时子组件传递过来的数据
let changeAddArticle = (content) => {
  addArticle.value.content = content
}

// 接收修改文章时子组件传递过来的数据
let changeUpdateArticle = (content) => {
  updateArticle.value.content = content
}


const tabValue = ref("list")
// 条目点击修改的时候
const update = async (item) => {
  tabValue.value = "update"
  const res = await axios.get(`/blog/getBlogById?id=${item.id}`)
  console.log(res)
  if (res.data.code == 200) {
    const blog = res.data.data;
    updateArticle.value.id = blog.id
    updateArticle.value.categoryId = blog.category_id
    updateArticle.value.title = blog.title
    updateArticle.value.content = blog.content
    child.value.setValueHtml(updateArticle.value.content)
  }
}
const updateCommit = async () => {
  let res = await axios.put("/blog/update", updateArticle.value)
  if (res.data.code == 200) {
    message.success("修改成功")
    updateArticle.value.content = ""
    child.value.setValueHtml(updateArticle.value.content)
    tabValue.value = "list"
  } else {
    message.error(res.data.msg)
  }
}


function toPage(pageNum) {
  console.log('点击了第' + pageNum + '页')
  // 调用子组件方法把页数传递给子组件
  child.value.setPage(pageNum)
}
</script>

<style scoped>

</style>
