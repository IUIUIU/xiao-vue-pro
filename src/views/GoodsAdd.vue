<template>

  <div>
    <!-- 封装面包屑导航的组件：BreadCrumb.vue-------------- -->
    <bread-crumb one="商品列表" two="添加商品" three="goods"></bread-crumb>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb> -->

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!-- 警告框：--------------------------- -->
      <el-alert title="需要添加商品分类的详细信息" type="info" show-icon center></el-alert>

      <!-- 步骤条设置： -->
      <el-steps :active="+activeName" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签切换导航： -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="tabBeforeLeave" @tab-click="tabClicked">
          <!-- 基本信息：表单域 -->
          <el-tab-pane label="基本信息" name="0">

            <!-- 商品名称： -->
            <el-form-item prop="goods_name" label="商品名称：">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格： -->
            <el-form-item prop="goods_price" label="商品价格：">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <!-- 商品重量： -->
            <el-form-item prop="goods_weight" label="商品重量：">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 商品数量： -->
            <el-form-item prop="goods_number" label="商品数量：">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 三级分类级联选择器： ------------------------------ -->
            <el-form-item label="商品分类：" prop="selectThreeCate">
              <!-- 级联选择器：--------------------- -->
                <el-cascader v-model="addForm.selectThreeCate" :options="cateList" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" @active-item-change="handleChange" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数：动态参数 -->
          <el-tab-pane label="动态参数" name="1">
            <el-form-item v-for="item in manyParamList" :key="item.attr_id" :label="item.attr_name">

              <!-- Checkbox 多选框:------------------------------ -->
              <el-checkbox-group v-model="item.vals_arr2">
                <el-checkbox v-for="item2 in item.vals_arr" :key="item2" :label="item2" border></el-checkbox>
              </el-checkbox-group>

            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性：静态参数 -->
          <el-tab-pane label="静态参数" name="2">

            <!-- 表单域：---------------------------------------- -->
            <el-form-item v-for="item in onlyParamList" :key="item.attr_id" :label="item.attr_name" label-width="150px">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>

          </el-tab-pane>

          <!-- 商品图片： -->
          <el-tab-pane label="商品图片" name="3">

            <!-- 上传图片： -->
            <el-upload action="http://127.0.0.1:11333/api/private/v1/upload" :on-remove="uploadRemove" list-type="picture" :on-success="uploadSuccess" :headers="uploadHeaders">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>

          </el-tab-pane>
          <!-- 商品分类： -->
          <el-tab-pane label="商品分类" name="4">

            <!-- 富文本编辑器： -->
            <!-- <quillEditor></quillEditor> -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods()">添加商品详情</el-button>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </el-card>
  </div>

</template>

<script>

// 富文本编辑器的相关引入配置：
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 按需引入：
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      // 设置同步：步骤条和标签切换导航
      activeName: '0',
      // 添加商品：
      addForm: {
        // 表单对象：
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        selectThreeCate: [], // 接收全局的分类信息（数组）
        pics: [], // 接收上传好的图片信息
        goods_introduce: '', // 商品详情描述
        goods_cat: '', // 收集商品的分类级别（数组转字符串）
        attrs: [] // 收集参数和可选值数据来存储
      },

      // 表单校验：
      addFormRules: {
        goods_name: [
          { required: true, message: '商品名称必填', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格必填', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量必填', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量必填', trigger: 'blur' }
        ],
        selectThreeCate: [
          { required: true, message: '商品分类必选', trigger: 'change' }
        ]
      },
      // 级联选择器的分类数据来源：
      cateList: [],

      // 接收选取好的第3级别分类的id值：
      selectCateId: 0,

      // 上传图片配置token
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },

      manyParamList: [],
      onlyParamList: []

      //
    }
  },

  methods: {
    // 级联选择器变化回调处理：--------------------------------------
    handleChange () {
      // 判断是否接收到第3级别分类，如果有，就把第3级别的id值赋值给selectCateId
      var len = this.addForm.selectThreeCate.length
      // console.log(len)
      if (len === 3) {
        this.selectCateId = this.addForm.selectThreeCate[2]
        // 把各个级别的分类的id，由数组转换成字符串
        this.addForm.goods_cat = this.addForm.selectThreeCate.join(',')
      } else {
        this.selectCateId = 0
        this.addForm.goods_cat = '' // 清除字符串
      }
    },

    // 获取全部级别的分类数据：--------------------------------------
    async getCateList () {
      var { data: dt } = await this.$http.get('categories', { params: { type: 3 } })
      // console.log(dt)
      // 将获取到的商品分类列表数据赋值给cateList
      this.cateList = dt.data
    },

    // 标签切换之前的回调处理——判断逻辑：是否选取选取第3级别分类--------
    tabBeforeLeave () {
      if (this.selectCateId === 0) {
        this.$message.error('请先选取第三级别分类！！')
        return false
      }
    },

    // 上传图片成功的回调处理函数---------------------------------
    uploadSuccess (res) {
      // res——response（图片上传成功的响应信息）
      // console.log(res)
      // res.data.tmp_path：获取到的图片的路径名
      // res.meta.status/msg：获取上传的状态信息
      // 上传失败的判断处理：
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把图片的路径名存储给表单对象pics
      var ok = { pic: res.data.tmp_path }
      this.addForm.pics.push(ok)
    },

    // 移除/删除图片成功的回调处理函数
    uploadRemove (picInfo) {
      console.log(picInfo)
      // picInfo.response.data.tmp_path：被删除图片的路径名
      // 遍历pics这个数组中的值，从中找到被删除图片对应的路径名的下标，然后将其彻底清除掉
      // findIndex： 查找数组中第一个满足条件的元素的下标
      var inx = this.addForm.pics.findIndex(item => {
        return item.pic === picInfo.response.data.tmp_path
      })
      // console.log(inx)
      // inx：被删除图片pics数组中的下标
      this.addForm.pics.splice(inx, 1)
    },

    // 切换标签导航回调函数：
    async tabClicked () {
      if (this.activeName === '1') {
        // 判断‘动态标签’被点击：获取动态参数列表
        var { data: dt } = await this.$http.get('categories/' + this.selectCateId + '/attributes', { params: { sel: 'many' } })
        // 把参数可选选项的值，由String——>Array(根据空格分开)
        // console.log(this.manyParamList)
        dt.data.forEach(element => {
          console.log(element)
          element.vals_arr = element.attr_vals.split(' ') // 给复选框
          element.vals_arr2 = element.attr_vals.split(' ') // 设置复选框：选中/不选中
          // console.log(element.vals_arr)
          // console.log(element.vals_arr2)
        })
        // 注意：此处有坑！！！----------------------------------------
        this.manyParamList = dt.data
      } else if (this.activeName === '2') {
        // 判断‘静态标签’被点击：获取静态参数列表
        var { data: dt2 } = await this.$http.get('categories/' + this.selectCateId + '/attributes', { params: { sel: 'only' } })
        this.onlyParamList = dt2.data
      }
    },

    // 收集商品详情数据，添加到数据库中存储起来
    addGoods () {
      // 校验表单：
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 1、收集动态参数表单数据
          this.manyParamList.forEach(element => {
            var val = { attr_id: element.attr_id, attr_value: element.vals_arr2.join(' ') }
            // 把val这个对象，当成数组存放到addForm中的attrs: []里面
            this.addForm.attrs.push(val)
          })

          // 2、收集静态参数表单数据
          this.onlyParamList.forEach(element => {
            var val = { attr_id: element.attr_id, attr_value: element.attr_vals }
            // 把val这个对象，当成数组存放到addForm中的attrs: []里面
            this.addForm.attrs.push(val)
          })

          console.log(this.addForm)

          // axiso发送请求，携带着数据往服务器的数据库中添加
          var { data: dt } = await this.$http.post('goods', this.addForm)
          console.log(dt)
          this.$message.success(dt.meta.msg)
          // 跳转页面到列表页：
          this.$router.push('goods')
        }
      })
    }
  },

  // 配置生命周期函数：------------------------------------------
  created () {
    this.getCateList()
  },

  // 注册富文本编辑器的模块组件：
  components: {
    // quill-editor
    quillEditor
  }
}
</script>

<style lang="less" scoped>
.el-steps,.el-tabs{
  margin-top: 30px;
}
</style>
