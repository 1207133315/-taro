import { createApp } from 'vue'
import './app.less'

const App = createApp({

  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  mounted() {
    console.log("mounted")
  },
  onLaunch(){
    console.log("onLaunch")
  },
  onShow (options) {
    console.log("onShow")
  },
  // 小程序进入后台时执行
  onHide(){
    console.log("onHide")
  }

})

export default App
