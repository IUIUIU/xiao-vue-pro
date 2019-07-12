<template>
  <div>
    <!-- 封装面包屑导航的组件：BreadCrumb.vue-------------- -->
    <bread-crumb one="商品管理" two="商品分类" three="categories"></bread-crumb>

    <!-- 添加分类弹框（对话框Dialog）： -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialog"
      width="50%"
      @close="resetForm()"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="110px">
        <!-- 分类名称：------------------------- -->
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name" ref="mycat_name" clearable @clear="getCateList()"></el-input>
        </el-form-item>
        <!-- 分类级别：------------------------- -->
        <el-form-item label="分类级别：" prop="selectTwoCate">
          <!-- 级联选择器：--------------------- -->
          <el-cascader v-model="addForm.selectTwoCate" :options="cateListTwo" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', checkStrictly:true }" @active-item-change="handleChange" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">添加</el-button>
      </span>
    </el-dialog>

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!-- 添加分类按钮：--------------------------------- -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表：table表格：----------------------------- -->
      <el-table :data="cateList" style="width: 100%;" border row-key="cat_id">
        <!-- 序号：---------------------------- -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <!-- 分类名称：------------------------ -->
        <el-table-column prop="cat_name" label="分类名称" width="330"></el-table-column>
        <!-- 状态：---------------------------- -->
        <el-table-column prop="mobile" label="是否有效" width="280">
          <i class="el-icon-circle-check" style="color: rgb(68, 178, 170);"></i>
        </el-table-column>
        <!-- 等级：---------------------------- -->
        <el-table-column prop="cat_level" label="等级" width="280">
          <template slot-scope="stDate">
            <el-tag v-if="stDate.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="stDate.row.cat_level===1">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>

        <!-- 操作按钮功能：---------------------------------- -->
        <el-table-column label="操作" width="296">
          <!-- 为了感知当前列通过stData插槽的属性row来获取到每个商品信息/具体的id值 -->
          <template slot-scope="stData">
            <!-- 编辑按钮：-------------------------------- -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(stData.row)"
            >编辑</el-button>
            <!-- 删除按钮：-------------------------------- -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(stData.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表：---------------------------------------
      cateList: [], // 接收商品分类数据

      reqParam: {
        type: 3, // 获取所有级别的分类
        pagenum: 1, // 获取第1页数据
        pagesize: 5 // 每页显示5条数据
      },

      // 添加分类弹框功能：--------------------------------
      addDialog: false, // 弹框默认隐藏
      // 添加分类Form表单对象：
      addForm: {
        cat_name: '',
        // 感知选取的分类上级，并且放在addForm中可以实现重置效果
        selectTwoCate: [],
        cat_pid: 0, // 新分类的上级
        cat_level: 0 // 新分类的等级
      },
      // 添加分类弹框——表单域校验：
      addFormRules: {
        cat_name: [
          // { required: 必填规则, message: '提示信息', trigger: '触发事件' }
          { required: true, message: '分类名必填', trigger: 'blur' }
        ]
      },
      // 可供选取的前两个级别的分类：
      cateListTwo: []

    }
  },

  methods: {
    // 获取商品分类列表的数据：
    async getCateList () {
      var { data: dt } = await this.$http.get('categories', {
        params: this.reqParam
      })
      // console.log(dt)
      // 把获取到商品分类列表数据赋值给cateList
      this.cateList = dt.data.result
    },
    // 序号：后续如果有方法再来搞：
    /* indexMethod (index) {
      return index++
    }, */

    // 添加分类弹框：
    async showAddDialog () {
      this.addDialog = true // 弹框显示
      // 获取级联选择其中可以选取的分类数据：(1-2等级的)
      var { data: dt } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(dt)
      // 把获取到的分类数据赋值给data成员
      this.cateListTwo = dt.data
    },

    // 感知级联选择器选取变化后的回调处理
    handleChange () {
      // 通过selectTwoCat计算pid和level
      // 判断selectTwoCate的数组长度：0：一级分类 1：二级分类 2：三级分类
      var cateArr = this.addForm.selectTwoCate
      // 判断这个数组的长度是对应的哪个级别的分类
      console.log(this.addForm.selectTwoCate) // 输出的是一个数组[一级，二级]——cateArr.length=2
      if (cateArr.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else if (cateArr.length === 1) {
        this.addForm.cat_pid = cateArr[0]
        this.addForm.cat_level = 1
      } else {
        this.addForm.cat_pid = cateArr[1]
        this.addForm.cat_level = 2
      }
    },

    // 请求添加分类数据并验证
    addCate () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.post('categories', this.addForm)
          // console.log(dt)
          this.addDialog = false
          this.$message.success(dt.meta.msg)
          this.getCateList()
        }
      })
    },

    // 给form表单做表面/本质的重置处理
    resetForm () {
      this.$refs.addFormRef.resetFields()
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    }

  },

  // 生命周期函数：当页面加载完毕时，就要获取到getCateList的数据：
  created () {
    this.getCateList()
  }

}

</script>

<style lang="less" scoped>
</style>
