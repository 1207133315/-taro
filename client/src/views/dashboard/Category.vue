<template>
  <div>
    <n-button @click="showAddModel=true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
      <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in categoryList">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>
          <n-space><!-- 让两个按钮有编剧-->
            <n-button @click="toUpdate(item)">修改</n-button>
            <n-button @click="handleConfirm(item)">删除</n-button>
          </n-space>
        </td>
      </tr>
      </tbody>
    </n-table>
    <n-modal v-model:show="showAddModel" preset="dialog" title="dialog">
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称"/>
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModel" preset="dialog" title="dialog">
      <template #header>
        <div>修改数据</div>
      </template>
      <div>
        <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称"/>
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import {AdminStore} from "../../stores/AdminStore.js";
import {useRouter, useRoute} from "vue-router";
import {ref, reactive, inject, onMounted} from "vue";

const thisRouter = useRouter()
const route = useRoute()
const adminStore = AdminStore()
const axios = inject("axios")
const message = inject("message");
const dialog = inject("dialog");

onMounted(() => {
  // 页面挂载的时候去请求数据
  loadData()
})
const categoryList = ref([])// 列表数据
const showAddModel = ref(false)// 是否显示添加弹窗
const showUpdateModel = ref(false)// 是否显示修改弹窗
const addCategory = ref({// 要添加的数据
  name: ""
})
const updateCategory = ref({// 要修改的数据
  id: 0,
  name: ""
})


// 加载列表数据
const loadData = async () => {
  let res = await axios.get("/category/token/list")
  console.log(res)
  if (res.data.code == 403) {
    message.error(res.data.msg)
    return
  }
  categoryList.value = res.data.data

}

// 点击添加之后
const add = async () => {
  let res = await axios.post("/category/token/add", {name: addCategory.value.name})
  console.log("添加数据" + res)
  if (res.data.code == 200) {
    message.success("添加成功")
    await loadData()
  } else {
    message.error(res.data.msg)
  }
  showAddModel.value = false
}
// 点击修改
const toUpdate=async (item)=>{
    showUpdateModel.value=true
    updateCategory.value.id=item.id
    updateCategory.value.name=item.name
}

// 点击修改数据的提交之后
const update = async () => {
  let res = await axios.put("/category/token/update", {id:updateCategory.value.id,name: updateCategory.value.name})
  console.log(res)
  if (res.data.code == 200) {
    message.success(res.data.msg)
    await loadData()
  } else {
    message.error(res.data.msg)
  }
  showUpdateModel.value = false
}


// 弹出提示框
const handleConfirm = (item) => {
  dialog.warning({
    title: '提示',
    content: `你确定删除${item.name}吗`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      removeCategory(item)
    }
  })
}

// 删除请求
const removeCategory = async (item) => {
  const res = await axios.delete(`/category/token/delete?id=${item.id}`)
  console.log(res)
  if (res.data.code == 200) {
    message.success(res.data.msg)
    await loadData()
  } else {
    message.error(res.data.msg)
  }
}


</script>

<style scoped>

</style>
