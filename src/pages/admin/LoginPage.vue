<template>

  <view>
    <at-card title="登录管理员账号" style="margin: 10px">
      <at-form :on-submit="onSubmit">
        <at-input
          name='value'
          title='账号:'
          type='text'
          placeholder='请输入账号'
          :value="adminInfo.account"
          :on-change="onAccountChange"
        />
        <at-input
          name='value'
          title='密码:'
          type='password'
          placeholder='请输入密码'
          :value="adminInfo.password"
          :on-change="onPasswordChange"
        />

        <view class="checkView">
          <checkbox value="选中" :checked="adminInfo.isSave" @tap="onCheckBoxChange">记住我</checkbox>
        </view>

        <at-button @click="onSubmit" :loading="adminInfo.isLoading" type="primary">提交</at-button>
      </at-form>
    </at-card>

  </view>
</template>

<script setup>
import {reactive} from "vue";
import Taro from "@tarojs/taro";
import {AdminStore} from "../stores/AdminStore"
import {AtForm,AtCard,AtInput} from "taro-ui-vue3";



const adminStore = AdminStore()
const adminInfo = reactive({
  account: Taro.getStorageSync("account") || "",
  password: Taro.getStorageSync("password") || "",
  isLoading: false,
  isSave: Taro.getStorageSync("password") || false
})

const onAccountChange = (value) => {
  adminInfo.account = value
}
const onPasswordChange = (value) => {
  adminInfo.password = value
}

const onSubmit = async (key, data) => {
  adminInfo.isLoading = true
  const res = await Taro.request({
    url: 'http://localhost:8080/admin/login',
    method: 'POST',
    data: {
      account: adminInfo.account,
      password: adminInfo.password
    }
  })
  adminInfo.isLoading = false
  console.log(res)
  if (res.data.code == 200) {
    await Taro.showToast({
      title: "登录成功",
      duration: 2000
    })
    adminStore.account = res.data.data.account
    adminStore.token = res.data.data.token
    adminStore.id = res.data.data.id
    if (adminInfo.isSave) {
      await Taro.setStorage({
        key: 'account',
        data: adminInfo.account
      })
      await Taro.setStorage({
        key: 'password',
        data: adminInfo.password
      })
      await Taro.setStorage({
        key: 'isSave',
        data: adminInfo.isSave
      })
    } else {
      Taro.removeStorageSync('account')
      Taro.removeStorageSync('password')
      Taro.removeStorageSync('isSave')
    }
    await Taro.navigateTo({
      url: '/pages/dashboard/DashBoard'
    })

  } else {
    await Taro.showToast({
      title: "登录失败",
      duration: 2000,
      icon: 'error'
    })
  }
}

const onCheckBoxChange = () => {
  adminInfo.isSave = !adminInfo.isSave
}
</script>

<style>
.checkView {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>
