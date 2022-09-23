import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createDiscreteApi} from 'naive-ui'
import naive from 'naive-ui'
import {createPinia} from 'pinia'
import router from "./common/router";
import axios from "axios";
// @ts-ignore
import {AdminStore} from "./stores/AdminStore";



/*
* axios 服务端通信
* pinia 状态管理
* less 简化css代码
* vue-router npm install vue-router@4
* naive-ui  npm i -D naive-ui
* wangEditor npm install @wangeditor/editor-for-vue@next --save  副文本编辑
* */
// 配置请求的baseurl
axios.defaults.baseURL = "http://localhost:8080"
// 添加拦截器
axios.interceptors.request.use((config)=>{
  config.headers={
    token:AdminStore().token
  }
  return config
})
const app = createApp(App)
const {message, notification, dialog} = createDiscreteApi(["message", "notification", "dialog"])
app.use(router)


app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("axios", axios) //全局提供axios
app.provide("server_baseUrl", axios.defaults.baseURL) //全局提供base
app.use(naive)
app.use((createPinia()))

app.mount('#app')
