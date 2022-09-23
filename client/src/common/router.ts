import {createRouter, createWebHashHistory} from "vue-router";
import constant from "./RouterConstants"

let routes = [
  {path: constant.testPath, component: () => import("../views/Test.vue")},
  {path: constant.loginPath, component: () => import ("../views/Login.vue")},
  {path: constant.detailPath, component: () => import ("../views/Detail.vue")},
  {
    path: constant.dashboardPath,
    component: () => import ("../views/detail/Dashboard.vue"),
    redirect: constant.dashboardArticlePath,
    children: [
      {path: constant.dashboardCategoryPath, component: () => import ("../views/detail/Category.vue")},
      {path: constant.dashboardArticlePath, component: () => import ("../views/detail/Article.vue")}
    ]
  },
  {path: "/", component: () => import ("../views/HomePage.vue")}
]

let router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
