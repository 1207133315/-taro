<template>
  <view class="index">
    <text @tap="loading">{{ msg }}</text>
    <checkbox @tap="loading" @change="">复选框</checkbox>
    <text>当前复选框的状态为:{{}}</text>
  </view>
</template>

<script>
import { ref } from 'vue'
import './index.less'
import Taro from "@tarojs/taro";

export default {

  setup () {
    const msg = ref('Hello123 ')
    const loading=()=>{
      console.log('点击了')
      Taro.showLoading({
        title:'加载中',
        mask:false
      })
      setTimeout(()=>{
        Taro.hideLoading()
      },3000)
    }


    return {
      msg,
      loading
    }
  }
}
</script>
