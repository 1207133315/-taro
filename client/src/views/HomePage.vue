<template>
  <div class="container">
    <div class="nav">
      <div @click="toHomePage">首页</div>
      <div>
        <n-popselect v-model:value="pageInfo.categoryId" :options="categoryOptions" trigger="click"
                     @update-value="searchByCategory">
          <div>分类<span>{{ categoryName }}</span></div>
        </n-popselect>
      </div>
      <div @click="toDashboardPage">后台</div>
    </div>
    <n-divider/><!--横线-->
    <n-space class="search">
      <n-input class="searchInput" v-model:value="pageInfo.keyword" :style="{width:'500px'}"
               placeholder="请输入关键字"/>
      <n-button type="primary" ghost @click="loadBlogs">搜索</n-button>
    </n-space>
    <blog-list ref="child" @getPageInfo="loadPageInfo"></blog-list>
    <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" @update-page="loadBlogs"/>

    <n-divider/><!--横线-->
    <div class="footer">
      <div>Power By XXXX</div>
      <div>XICP备XXXXX号-1</div>
    </div>
  </div>

</template>

<script setup>

import BlogList from "../components/BlogList.vue";
import RouterConstants from "../common/RouterConstants.ts";
import {useRouter, useRoute} from "vue-router";
import {ref, reactive, inject, onMounted, computed} from "vue";

const router = useRouter()
const route = useRoute()
const axios = inject("axios")
const message = inject("message");
const dialog = inject("dialog");
const child = ref()

const categoryOptions = ref([])

onMounted(() => {
  loadCategory()
  child.value.hideButton()
})


const categoryName = computed(() => {
  let selectOption = categoryOptions.value.find((option) => {
    return option.value == pageInfo.value.categoryId
  })
  return selectOption ? selectOption.label : ''
})

const loadCategory = async () => {
  let res = await axios.get("/category/list")
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

let pageInfo = ref({})
// 接收blogList组件传递过来的pageInfo数据
const loadPageInfo = (info) => {
  pageInfo.value = info
}

// 分页组件的回调
const loadBlogs = () => {
  child.value.loadBlogs()
}

const toDashboardPage = () => {
  router.push(RouterConstants.loginPath)
}
const toHomePage = () => {
  router.push("/")
}
const searchByCategory = (id) => {
  pageInfo.value.categoryId = id
  child.value.loadBlogs()
}

</script>

<style lang="less" scoped>
.container {
  background: #64676a;
  width: 1200px;
  margin: 0 auto;
  display: inline;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: gray;

  div {
    cursor: pointer;
    margin-left: 15px;

    &:hover {
      color: #fd760e;
    }

    span {
      font-size: 12px;
    }
  }
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}

.search {

  width: 600px;
  margin: auto;

}



</style>
