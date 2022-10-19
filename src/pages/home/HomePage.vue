<template>


  <view class="home-page">
    <view class="home-search">
      <at-search-bar show-action-button :value="pageInfo.keyword" :on-change="onSearchChange"
                     :on-action-click="onActionClick" placeholder="请输入关键字" input-type="text" :max-length="300"
                     action-name="点击搜索"></at-search-bar>
      <view>
        <picker mode='selector' :range="pickerInfo.selector" :onChange="onPickerChange" rangeKey="name">
          <at-list>
            <at-list-item :title='pickerInfo.selectorChecked'/>
          </at-list>
        </picker>
      </view>
    </view>


      <scroll-view  class="scroll" :scroll-y="true"  >
        <view v-for="item in blogList" style="-webkit-box-orient: vertical;" id="111">
          <at-card :title="item.title" style="margin-top: 20px" :extra="item.create_time">
            {{ item.content }}
          </at-card>
        </view>
      </scroll-view>

    <view>
      <at-pagination class="pagination" :total="pageInfo.count" :current="pageInfo.page" :page-size="pageInfo.pageSize"
                     icon
                     :on-page-change="onPageChange"></at-pagination>
    </view>


  </view>

</template>

<script setup>


import {onMounted, reactive, ref} from "vue";
import Taro from "@tarojs/taro";
import {View, Text, Picker} from '@tarojs/components'
import {ScrollView} from '@tarojs/components'

const blogList = ref([])
const pageInfo = reactive({
  page: 1,// 页数
  pageSize: 6,// 一页多少数据
  pageCount: 0,// 总共有多少页
  count: 0,// 总共有多少数据
  keyword: "",
  categoryId: 0
})


const pickerInfo = ref({
  selector: [],
  selectorChecked: '选择分类'
})

const onPickerChange = (e) => {
  console.log('onPickerChange')
  pickerInfo.value.selectorChecked = pickerInfo.value.selector[e.detail.value].name
  pageInfo.categoryId = pickerInfo.value.selector[e.detail.value].id
  loadBlogs()

}

const onSearchChange = (value) => {
  pageInfo.keyword = value

}
const onActionClick = () => {
  loadBlogs()
}
onMounted(() => {
  loadCategory()
  loadBlogs()
})
const loadCategory = async () => {
  const res = await Taro.request({
    url: `http://localhost:8080/category/list`,
    methods: "GET"
  })
  if (res.data.code == 200) {
    pickerInfo.value.selector = []
    pickerInfo.value.selector.push({id: 0, name: '全部'})
    for (let i = 0; i < res.data.data.length; i++) {
      pickerInfo.value.selector.push(res.data.data[i])
    }
  }
}

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

<style scoped>

</style>
<style lang="less">

.home-page {
  width: 100%;
  height: 100%;
  background: #cccccc;
  display: flex;
  position: absolute;
  flex-direction: column;


  .scroll {
    overflow-y: auto;

  }

  .pagination {
    position: absolute;
    bottom: 0;
    width: 100%;

    margin: auto;
  }
}


</style>
