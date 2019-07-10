<template>
  <div>
    <!-- 面包屑导航：----------------------------------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!-- 警告框：--------------------------- -->
      <el-alert title="注意：只允许设置第三级别分类参数" type="warning" show-icon></el-alert>

      <!-- 三级分类级联选择器： ------------------------------ -->
      <el-row>
        <el-col>
          <span>选择商品分类： </span>
          <!-- 级联选择器：--------------------- -->
          <el-cascader v-model="selectThreeCate" :options="cateList" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" @active-item-change="handleChange" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs标签切换：-------------------------- -->
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <!-- 动态参数按钮：----------------------- -->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="disBtn" size="mini">添加动态参数</el-button>
            <!-- 动态数据列表：--------------------- -->
            <el-table :data="manyParamList">
              <!-- 扩展行：------------------------- -->
              <el-table-column type="expand">
                <template slot-scope="stData">
                  <!-- Tag 标签：------------------- -->
                  <el-tag v-for="item in stData.row.vals_arr" :key="item"  closable>{{item}}</el-tag>
                </template>
              </el-table-column>

              <!-- 动态参数表格：------------------- -->
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" width="240">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(stData.row)'>编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click='showEditDialog(stData.row).id'>删除</el-button>
              </el-table-column>

            </el-table>
          </el-tab-pane>

          <!-- 静态参数按钮：---------------------- -->
          <el-tab-pane label="静态参数" name="only">
            <el-button type="primary" :disabled="disBtn" size="mini">添加静态参数</el-button>
            <!-- 静态数据列表：-------------------- -->
            <el-table :data="onlyParamList">
              <!-- 扩展行：----------------------- -->
              <el-table-column type="expand">
                <template slot-scope="stData">
                  <!-- Tag 标签：------------------- -->
                  <el-tag v-for="item in stData.row.vals_arr" :key="item"  closable>{{item}}</el-tag>
                </template>
              </el-table-column>

              <!-- 静态参数表格：-------------------- -->
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" width="240">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(stData.row)'>编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click='showEditDialog(stData.row).id'>删除</el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数：
  created () {
    this.getCateList()
  },

  data () {
    return {
      // 级联选择器获取数据信息的
      cateList: [],
      // 存放选取的第三级别分类的选项（数组形式）
      selectThreeCate: [],
      // 标签切换默认选中设置：静态参数
      activeName: 'only',
      // 控制按钮开关：禁用：true / 激活：false
      disBtn: true,
      // 获取第3级别分类id：
      selectCateId: 0,
      // 接收：参数数据
      manyParamList: [], // 动态参数
      onlyParamList: [] // 静态参数

    }
  },

  methods: {
    // 级联选择器，选取选项变化的回调处理
    handleChange () {
      // 判断是否选取了第三级别分类，长度len
      var len = this.selectThreeCate.length
      // 注意：但是有些分类选项只有两个级别，没有第三级别的分类
      if (len === 3) {
        // 当长度等于3的时候，激活添加按钮
        this.disBtn = false
        // 把第3级别分类id赋值给selectCateId
        this.selectCateId = this.selectThreeCate[2]
        // 获取列表参数信息：
        this.getParamList()
      } else {
        // 否则长度不等于3的时候，就是没有选取第三级别分类：就禁用按钮
        this.disBtn = true
        // 当只有2级分类时，我们就让这个级联选择器自动清空，（警告框：只能为第三级分类添加参数）
        this.selectThreeCate = []
        // 清除selectCateId：
        this.selectCateId = 0
        // 当没有选中第3级别分类时(当清空级联选择器中的数据信息时)，就需要把已经获取好的参数列表数据清空：
        this.manyParamList = []
        this.onlyParamList = []
      }
    },

    // 获取全部级别的分类数据：
    async getCateList () {
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      // console.log(dt)
      // 将获取到的商品分类列表数据赋值给cateList
      this.cateList = dt.data
    },

    // 获取列表参数数据信息：
    async getParamList () {
      var { data: dt } = await this.$http.get('categories/' + this.selectCateId + '/attributes', { params: { sel: this.activeName } })
      console.log(dt)

      // 把获取到的列表参数数据中的attr_vals字符串的内容的每一项，通过遍历并且以空格来切分成数组
      dt.data.forEach(element => {
        element.vals_arr = element.attr_vals.split(' ') // 将切分好的数据，存放在vals_arr数组中
      })
      // 判断参数类型（only（静态） / many（动态））
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },

    // 切换标签执行回调函数：
    handleClick () {
      // 判断如果选中第三级别分类，就需要获取列表参数的数据
      if (this.selectCateId !== 0) {
        this.getParamList()
      }
    }

  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-top: 15px;
}
.el-tag{
  margin: 10px 5px;
}
</style>
