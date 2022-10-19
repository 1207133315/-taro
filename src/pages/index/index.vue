<template >

  <view class="box">
    <view class="top"></view>
    <view class="content">
      <view></view>
    </view>
    <view class="footer"></view>
  </view>
</template>

<script setup>


</script>

<style  lang="less">
.box {

  width: 100%;
  height: 100vh;
  background: gray;
  display: flex;
  position: absolute;
  flex-direction: column;
  .top {
    height: 300px;
    width: 80px;
    background: #fd760e;
    position: relative;
    top: 0;
  }
  .content {
    background: green;
    position: relative;
    width: 100vh;
    flex: 1;


  }
  .footer {
    height: 300px;
    background: blue;
    width: 80px;
    position: relative;
    bottom: 0;

  }
}
</style>
