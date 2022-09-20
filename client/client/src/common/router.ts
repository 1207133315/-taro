import {createRouter, createWebHashHistory} from "vue-router";

let routes = [
  {path: "/test", component: () => import("../views/Test.vue")},
  {path: "/login", component: () => import ("../views/Login.vue")},
  {path: "/detail", component: () => import ("../views/detail/Dashboard.vue"), children: [
      {path: "/detail/category", component: () => import ("../views/detail/Category.vue")},
      {path: "/detail/article", component: () => import ("../views/detail/Article.vue")}
    ]
  }
]

let router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
