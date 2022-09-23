import {createApp} from 'vue'
import './app.less'
// @ts-ignore
import {createPinia} from "pinia";
// @ts-ignore
import {createUI} from "taro-ui-vue3";
// 引入全部组件样式
import 'taro-ui-vue3/dist/style/index.scss'
// @ts-ignore
import Taro from "@tarojs/taro";


// @ts-ignore
import {AdminStore} from "./pages/stores/AdminStore";


/*
* 状态管理使用pinia
* taro-ui-vue3  ui组件使用
*
* */


const app = createApp({

  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  mounted() {
    console.log("mounted")
  },
  onLaunch() {
    console.log("onLaunch")
  },
  onShow(options) {
    console.log("onShow")
  //  updateApp()
 //   getOpenId()
  },
  // 小程序进入后台时执行
  onHide() {
    console.log("onHide")
  }

})
app.use((createPinia()))
app.use((createUI()))
app.provide("adminStore",AdminStore())
// app.use(axios)
// app.provide("axios", axios) //全局提供axios
// // 登录
// const getOpenId =  () => {
//   Taro.login({
//     success: async (res) => {
//
//     }
//   })
// }





// // 检查版本更新
// function updateApp() {
//   if (process.env.TARO_ENV === 'weapp') {
//     const updateManager = Taro.getUpdateManager()
//     updateManager.onCheckForUpdate(function (res) {
//       // 请求完新版本信息的回调
//       console.log(res.hasUpdate)
//     })
//     updateManager.onUpdateReady(function () {
//       Taro.showModal({
//         title: '更新提示',
//         content: '新版本已经准备好，是否重启应用？',
//         success: function (res) {
//           if (res.confirm) {
//             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//             updateManager.applyUpdate()
//           }
//         }
//       })
//     })
//     updateManager.onUpdateFailed(function () {
//       // 新的版本下载失败
//     })
//   }
//
// }


export default app
