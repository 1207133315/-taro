<template>
  <div class="container">
    <n-button @click="router.back()">返回</n-button>

    <!--  标题-->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!--  文章内容-->
    <div class="blog-container">
      <div v-html="blogInfo.content "></div>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {ref, reactive, inject, onMounted, computed} from "vue";

const router = useRouter()
const route = useRoute()
const axios = inject("axios")
const message = inject("message");
const dialog = inject("dialog");
const blogInfo = ref({})
onMounted(() => {
  loadBlog()
})
const loadBlog = async () => {
  const blogId = route.query.id
  const res = await axios.get(`/blog/getBlogById?id=${blogId}`)
  if (res.data.code == 200) {
    blogInfo.value = res.data.data
  }


}
</script>

<style>
.blog-container img{
  max-width: 100% !important;
}

</style>
<style lang="less" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

</style>
