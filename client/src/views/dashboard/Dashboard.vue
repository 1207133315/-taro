<template>

  <div class="main-panel">
    <div class="logo" @click="thisRouter.push(RouterConstants.homePath)"><span>返回首页</span></div>
    <div class="menus">
      <div v-for="(menu,index) in menus" @click="toPege(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding: 20px;width: 100%">
      <router-view></router-view>
    </div>
  </div>
  <!--  <div class="title">-->
  <!--    后台管理系统-->
  <!--  </div>-->
</template>

<script setup>
import "../detail/less/Dashboard.less"
import {AdminStore} from "../../stores/AdminStore.js";
import {useRouter, useRoute} from "vue-router";
import RouterConstants from "../../common/RouterConstants.ts";

const thisRouter = useRouter()
const route = useRoute()
const adminStore = AdminStore()
let menus = [
  {name: "文章管理", href: RouterConstants.dashboardArticlePath},
  {name: "分类管理", href: RouterConstants.dashboardCategoryPath},
  {name: "退出登录", href: "logout"}
]

const toPege = (menu) => {
  if (menu.href == 'logout') {
    thisRouter.push(RouterConstants.loginPath)
  } else {
    thisRouter.push(menu.href)
  }
  console.log('点击了')
}

</script>


<style lang="less" scoped>
.logo {
  display: flex;
  width: 15%;
  background: aquamarine;
  height: 200px;
  span{
    margin: auto;
  }
  cursor: pointer;

  &:hover {
    color: green;
  }
}
</style>
