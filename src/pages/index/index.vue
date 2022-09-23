<template>
  <view class="index">
    <text>{{ msg }}</text>
    <checkbox value="选中" :checked="isChecked" @tap="checkboxClick"></checkbox>
    <text>当前复选框的状态为:{{ isChecked }}</text>
  </view>
  <view>
    <button :loading="true" :plain="true" type="primary" @tap="login">按钮</button>
  </view>
</template>

<script setup>
import {inject, onMounted, reactive, ref} from 'vue'
import './index.less'
import Taro from "@tarojs/taro";

//const axios = inject("axios")
const msg = ref('Hello123 ')
import {Checkbox, Button, View, Text} from "@tarojs/components"
const adminStore=inject("adminStore")
const isChecked = ref(false)
const admin = reactive({
  account: "user",
  password: "123456"

})


const checkboxClick = () => {
  isChecked.value = !isChecked.value
  console.log(isChecked.value)
}
onMounted(() => {
})

const login = async () => {
  const res = await Taro.request({
    url: 'http://localhost:8080/admin/login',
    data: admin,
    method: 'POST',
    header: {'content-type': 'application/json'}
  })// 默认值
  console.log(res)
  if (res.data.code == 200) {
    adminStore.token=res.data.data.token
    adminStore.account=res.data.data.account
    adminStore.password=res.data.data.password
    await Taro.showToast({
      title: '登录成功'
    })
  }
}


</script>

<style scoped lang="less">

</style>
