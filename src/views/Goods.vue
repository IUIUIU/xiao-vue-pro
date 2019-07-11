<template>
  <div>
    <!-- 面包屑导航：----------------------------------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框：要改就需要将script方法和数据都修改一遍 -->
          <el-input placeholder="请输入搜索内容" v-model="reqParam.query" clearable @clear="search" @keyup.enter.native="search">
            <!-- 搜索按钮：-------------------------------- -->
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/goodsadd')">添加商品</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column label="创建时间" width="190">
          <template slot-scope="stData">
            <span>{{ stData.row.add_time | dateFormat('上海') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器：----------------------------------------- -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="reqParam.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="reqParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [], // 商品列表数据
      // 为了方便获取用户数据，可以把所有的参数通过对象的方式集合之后，再进行传递参数
      sum: 0, // 暂存一个变量来接收总条数
      reqParam: {
        query: '', // 查询参数搜索关键字
        pagenum: 1, // 当前页码：1
        pagesize: +window.localStorage.getItem('pagenum') || 3 // 每页显示条数：获取localStorage中存放已选择的每页显示几条  或者 默认显示3条
      }
    }
  },

  created () {
    this.getGoodsList()
  },

  methods: {
    // 删除商品
    async delGoods (goodsId) {
      this.$confirm('确认要删除该商品么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('goods/' + goodsId)
          // console.log(dt)
          // 删除成功提示：
          this.$message.success(dt.meta.msg)

          // 判断当前页面是非首页，数据只有一条，那么删除数据时，页码就需要操作递减（显示上一页的数据）
          if (this.reqParam.pagenum !== 1 && this.userList.length === 1) {
            this.reqParam.pagenum--
          }
          // 刷新
          this.getGoodsList()
        })
        .catch(() => {})
    },

    // 根据关键字检索数据
    search () {
      this.reqParam.pagenum = 1
      this.getGoodsList()
    },

    // 每页显示条数变化回调
    handleSizeChange (newsize) {
      this.reqParam.pagesize = newsize
      // 将选择的页数（newsize）存放在变量（pagenum），将这个页数存放在localStorage中，下次刷新页面时会记录上次选择每页显示几条的这个选项
      window.localStorage.setItem('pagenum', newsize)
      this.getGoodsList()
    },

    // 页码变化回调处理
    handleCurrentChange (newpage) {
      this.reqParam.pagenum = newpage
      this.getGoodsList()
    },

    // 获取商品列表数据
    async getGoodsList () {
      var { data: res } = await this.$http.get('goods', {
        params: this.reqParam
      })

      // console.log(res)
      this.goodsList = res.data.goods
      // 接收总条数：
      this.sum = res.data.total
    }
  },

  // 过滤器：
  filters: {
    dateFormat (origin, addr) {
      // console.log(origin) // 时间戳
      // 通过origin原始事件重新实例化一个时间对象
      // var tm = new Date(对象/时间戳)
      // 根据指定的事件实例化事件对象
      var tm = new Date(origin)
      var yyyy = tm.getFullYear()
      var mm = tm.getMonth() + 1
      var dd = tm.getDate()
      var hh = tm.getHours()
      var ii = tm.getMinutes()
      var ss = tm.getSeconds()

      return `${addr}：${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`
    }
  }
}
</script>

<style lang="less" scoped>

</style>
