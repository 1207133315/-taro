<template>
  <div class="login-panel">
    <n-card title="卡片插槽">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号"/>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="admin.password" type="password" placeholder="请输入密码"/>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.rember" label="记住我"/>
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from "vue";
import {AdminStore} from "../stores/AdminStore.js"

import {useRouter,useRoute} from "vue-router";
import RouterConstants from "../common/RouterConstants.ts";
const thisRouter=useRouter()
const route=useRoute()

const adminStore = AdminStore()

const axios = inject("axios")
const message = inject("message");

let rules = {
  account: [
    {required: true, message: "请输入账号", trigger: "blur"},
    {min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur"}
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur"}
  ]
}

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  rember: localStorage.getItem("rember") == 1 || false
})


const login = async () => {
  // 请求登录
  let result = await axios.post("/admin/login", {
    // 参数
    account: admin.account,
    password: admin.password
  })
  if (result.data.code == 200) {
    // 数据存储
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id
    if (admin.rember) {
      localStorage.setItem("account", admin.account)
      localStorage.setItem("password", admin.password)
      localStorage.setItem("rember", admin.rember ? 1 : 0)
    }
    thisRouter.push(RouterConstants.dashboardPath).then(r => {
      console.log('完成跳转')
    })
    message.success("登录成功")

  } else {
    message.error("登录失败")
  }
  console.log(result)
}
</script>

<style scoped>
.login-panel {
  width: 500px;
  margin: 130px auto 0;
}
</style>
