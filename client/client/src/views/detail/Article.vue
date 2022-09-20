<template>
  <!--    tab
  default-value 默认显示哪个tab
  justify-content 排列方式 evenly 均匀排列
  type 类型

  -->
  <n-tabs default-value="add" justify-content="space-evenly" type="line">
    <n-tab-pane name="oasis" tab="Oasis">

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
          <rich-text-editor v-model:value="addArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="commit">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>

    <n-tab-pane name="zou" tab="周杰伦">

    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import {AdminStore} from "../../stores/AdminStore.js";
import {useRouter, useRoute} from "vue-router";
import {ref, reactive, inject, onMounted} from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue"

const thisRouter = useRouter()
const route = useRoute()
const adminStore = AdminStore()
const axios = inject("axios")
const message = inject("message");
const dialog = inject("dialog");

const addArticle = ref({
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
  console.log(categoryOptions.value)
}

const commit = async () => {
  let res = await axios.post("/blog/add", addArticle.value)
  console.log("添加数据" + res)
  if (res.data.code == 200) {
    message.success("提交成功")
    addArticle.value.title=""
    addArticle.value.content=""
    addArticle.value.categoryId=''
  } else {
    message.error(res.data.msg)
  }
}
</script>

<style scoped>

</style>
