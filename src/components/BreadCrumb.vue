<template>

  <div>
      <!-- 封装面包屑导航的组件：BreadCrumb.vue ------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/'+three}">{{one}}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{path:`${three}`}">{{one}}</el-breadcrumb-item> -->
      <el-breadcrumb-item>{{two}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<script>

export default {
  props: ['one', 'two', 'three']
}
</script>

<style lang="less" scoped>

</style>
