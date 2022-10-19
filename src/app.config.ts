export default defineAppConfig({
  pages: [
    'pages/home/HomePage',
    'pages/index/index',
    'pages/index/detail',
    'pages/admin/LoginPage',
    'pages/dashboard/DashBoard'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },

  tabBar: {
    list: [
      {
        pagePath: 'pages/home/HomePage',
        text: '首页'
      },
      {
        pagePath: 'pages/index/index',
        text: '分类'
      },
      {
        pagePath: 'pages/admin/LoginPage',
        text: '后台'
      }
    ],
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  }
})
