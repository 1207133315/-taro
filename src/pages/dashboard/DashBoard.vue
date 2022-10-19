<template>
  <view >
    <AtTabs :current="tabInfo.current" :tabList="tabInfo.tabs" :onClick="onTabClick"  >
      <AtTabsPane :current="tabInfo.current" :index="0"  >
        <scroll-view  :scroll-y="true" style=" height: 80vh ; padding-bottom: 100px;" :onScrollToLower ="onScrollToLower" :onScrollToUpper="onScrollToLower">
          <view v-for="item in blogList" style="-webkit-box-orient: vertical;" id="111">
              <at-card :title="item.title" style="margin-top: 20px" :extra="item.create_time">
                {{ item.content }}
              </at-card>
          </view>
        </scroll-view>
      </AtTabsPane>
      <AtTabsPane :current="tabInfo.current" :index="1">
        <view style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</view>
      </AtTabsPane>
    </AtTabs>
  </view>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import Taro from "@tarojs/taro";
import {ScrollView} from '@tarojs/components'

const blogList = ref([])
const tabInfo = reactive({
  tabs: [{title: '文章管理', index: 0},
    {title: '分类管理', index: 1}],
  current: 0
})

const pageInfo = reactive({
  page: 1,// 页数
  pageSize: 6,// 一页多少数据
  pageCount: 0,// 总共有多少页
  count: 0,// 总共有多少数据
  keyword: "",
  categoryId: 0
})

const onScrollToLower=()=>{
  console.log('加载更多')
}


const onTabClick = (value) => {
  tabInfo.current = value
}

onMounted(() => {
  loadBlogs()
})




const loadBlogs = async () => {
  const res = await Taro.request({
    url: `http://localhost:8080/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&keyword=${pageInfo.keyword}&categoryId=${pageInfo.categoryId}`,
    methods: "GET"
  })
  let rows = res.data.data.rows
  for (let row of rows) {
    if (row.content.length > 50) {
      row.content = row.content.substr(0, 50) + "..."
    }
    const date = new Date(row.create_time);
    row.create_time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  const count = res.data.data.count
  pageInfo.count = count
  // 计算可以分成几页 Math.floor向下取整
  pageInfo.pageCount = Math.floor(count / pageInfo.pageSize) + (count % pageInfo.pageSize > 0 ? 1 : 0)
  blogList.value = rows

}
const onPageChange = (content) => {
  pageInfo.page = content.current
  loadBlogs()
}

</script>

<style scoped lang="less">

</style>
