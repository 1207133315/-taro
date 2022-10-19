<template>
  <text></text>
</template>

<script setup>
import {getCurrentInstance} from "@tarojs/taro";

let params=getCurrentInstance().router.params
console.log(params)
</script>

<style scoped>

</style>
