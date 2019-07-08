<template>
  <div>
    <!-- 面包屑导航：----------------------------------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加用户按钮的弹框：---------------------------------- -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      width="50%"
      @close="$refs.addFormRef.resetFields()"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" ref="myname" clearable @clear="getUserList()"></el-input>
        </el-form-item>
        <!-- 密码： -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            show-password
            ref="mypass"
            clearable
            @clear="getUserList()"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" ref="myemail" clearable @clear="getUserList()"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" ref="mymobile" clearable @clear="getUserList()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">提交</el-button>
      </span>
    </el-dialog>

    <!-- 操作按钮：修改用户的弹框：---------------------------- -->
    <el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editForm={}">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            ref="myname"
            clearable
            @clear="getUserList()"
            disabled
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            ref="myemail"
            clearable
            @keyup.enter.native="editUser()"
            @clear="getUserList()"
          ></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            ref="mymobile"
            clearable
            @keyup.enter.native="editUser()"
            @clear="getUserList()"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">提交</el-button>
      </span>
    </el-dialog>

    <!-- 设置角色分配按钮的弹框：----------------------------- -->
    <el-dialog title="用户分配角色" :visible.sync="assigDialog" width="50%" @close="$refs.assigFormRef.resetFields()">
      <el-form ref="assigFormRef" :model="assigForm" label-width="120px">
        <!-- 用户名： -->
        <el-form-item label="当前用户：" prop="username">{{assigForm.username}}</el-form-item>
        <!-- 角色： -->
        <el-form-item label="当前角色：" prop="role_name">{{assigForm.role_name}}</el-form-item>
        <!-- 新分配角色： -->
        <el-form-item label="新分配角色：" prop="rid">
          <!-- 下拉列表： -->
          <el-select v-model="assigForm.rid" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assigDialog = false">取 消</el-button>
        <el-button type="primary" @click="assigUser()">提交</el-button>
      </span>
    </el-dialog>

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!-- 搜索框/按钮：------------------------------------- -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框： -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="reqParam.query"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <!-- 搜索按钮：-------------------------------- -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>

        <!-- 添加用户按钮：--------------------------------- -->
        <el-col :span="7">
          <el-button type="primary" @click="addDialog=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表：table表格：----------------------------- -->
      <el-table :data="userList" style="width: 100%;" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="250"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="220"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
        <el-table-column label="状态" width="100">
          <!-- 切换开关按钮： -->
          <!-- 作用域插槽：为了感知当前列显示的状态：mg_state的取值是true/false -->
          <!--  -->
          <el-switch slot-scope="stData" v-model="stData.row.mg_state" active-color="#13ce66" @change="modState(stData.row.id, stData.row.mg_state)"></el-switch>
        </el-table-column>

        <!-- 操作按钮功能：---------------------------------- -->
        <el-table-column label="操作" width="232">
          <!-- 为了感知当前列通过stData插槽的属性row来获取到每个用户信息/具体的id值 -->
          <template slot-scope="stData">
            <!-- 编辑图标按钮：-------------------------------- -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(stData.row)"
            ></el-button>
            <!-- 删除图标按钮：-------------------------------- -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(stData.row.id)"
            ></el-button>
            <!-- 设置分配角色图标按钮：------------------------------- -->
            <el-tooltip class="item" effect="dark" content="设置角色" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showAssigDialog(stData.row)"></el-button>
            </el-tooltip>
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
    // 自定义校验规则：value被校验的数据，callback回调函数：校验成功/失败都会被执行
    var checkName = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9\u4E00-\u9FA5_-]{3,16}$/ // 字母和汉字
      if (!reg.test(value)) {
        return callback(new Error('用户名格式不正确'))
      } else {
        callback()
      }
    }

    var checkPsw = (rule, value, callback) => {
      var reg = /^\d{6,}$/ // 数字
      if (!reg.test(value)) {
        return callback(new Error('密码格式不正确'))
      } else {
        callback()
      }
    }

    var checkEmail = (rule, value, callback) => {
      var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!reg.test(value)) {
        // console.log(this.$refs.mymobile.getInput())
        this.$refs.myemail.getInput().style.border = '2px solid red'
        return callback(new Error('邮箱格式不正确'))
      } else {
        this.$refs.myemail.getInput().style.border = '2px solid green'
        callback()
      }
    }

    var checkMobile = (rule, value, callback) => {
      var reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        this.$refs.mymobile.getInput().style.border = '2px solid red'
        return callback(new Error('手机号格式不正确'))
      } else {
        this.$refs.mymobile.getInput().style.border = '2px solid green'
        callback()
      }
    }

    return {
      // 用来接收获取到的用户真实数据：
      userList: [],
      // 为了方便获取用户数据，可以把所有的参数通过对象的方式集合之后，再进行传递参数
      sum: 0, // 暂存一个变量来接收总条数
      reqParam: {
        query: '', // 查询参数搜索关键字
        pagenum: 1, // 当前页码：1
        pagesize: +window.localStorage.getItem('pagenum') || 3 // 每页显示条数：获取localStorage中存放已选择的每页显示几条  或者 默认显示3条
      },

      // 添加用户弹框功能：----------------------------------------
      addDialog: false, // 弹框默认隐藏
      // 添加用户Form表单对象：
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户弹框——表单域校验：
      addFormRules: {
        username: [
          // { required: 必填规则, message: '提示信息', trigger: '触发事件' }
          { required: true, message: '用户名必填', trigger: 'blur' },
          { validator: checkName, trigger: 'change' }
        ],

        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: checkPsw, trigger: 'change' }
        ],

        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { validator: checkEmail, trigger: 'change' }
        ],

        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'change' }
        ]
      },

      // 修改用户弹框功能：----------------------------------------
      editDialog: false, // 弹框默认隐藏
      // Form表单对象：
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户弹框——表单域校验：
      editFormRules: {
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { validator: checkEmail, trigger: 'change' }
        ],

        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'change' }
        ]
      },

      // 分配角色弹框：--------------------------------------------
      assigDialog: false, // 弹框隐藏
      // 分配角色表单对象：
      assigForm: {
        id: '', // 存储一个空的id
        username: '',
        role_name: '',
        rid: '' // 接收新分配的角色（下拉框选项）
      },
      // roleList数组：来接收可以分配的角色信息
      roleList: []
    }
  },

  // 在生命周期函数中获取用户列表数据：
  created () {
    this.getUserList()
  },

  methods: {
    // getUserList()是用来获取用户列表数据：----------------------
    async getUserList () {
      var { data: dt } = await this.$http.get('users', {
        params: this.reqParam
      })
      // console.log(dt)
      // 接收总条数：
      this.sum = dt.data.total
      // 判断获取数据失败的提示：（这一步被响应拦截器一起处理了）
      /* if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      } */
      // 把获取到的数据赋值给userList数组来接收
      this.userList = dt.data.users
    },

    // 分页功能：-----------------------------------------------
    handleSizeChange (newsize) {
      // 每页条数发生改变是触发的事件：
      // console.log(newsize) // 改变后的每页显示条数
      // 将变化后的显示条数赋值给：reqParam.pagesize
      console.log(newsize)
      this.reqParam.pagesize = newsize
      // 将选择的页数（newsize）存放在变量（pagenum），将这个页数存放在localStorage中，下次刷新页面时会记录上次选择每页显示几条的这个选项
      window.localStorage.setItem('pagenum', newsize)
      this.getUserList() // 根据新的显示条数来重新渲染页面
    },

    handleCurrentChange (newpage) {
      // 当前页发生改变出会触发的事件：
      // console.log(newpage) // 改变后的页码数
      // 将变化后的页面赋值给：reqParam.pagenum
      this.reqParam.pagenum = newpage
      this.getUserList() // 根据新的页码数来重新渲染页面
    },

    // 添加用户数据的操作：--------------------------------------
    addUser () {
      // 给提交按钮设置表单校验功能：
      console.log(this.$refs.addFormRef)
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 利用axios把收集到的新添加的数据存储到数据库中
          var { data: dt } = await this.$http.post('users', this.addForm)
          // console.log(dt)
          // 关闭弹框：
          this.addDialog = false
          // 显示添加成功提示：
          this.$message.success(dt.meta.msg)
          // 刷新页面数据：
          this.getUserList()
        }
      })
    },

    // 删除用户数据操作：----------------------------------------
    delUser (uid) {
      // 删除确认弹框：
      this.$confirm('确认删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          var { data: dt } = await this.$http.delete('users/' + uid)
          // console.log(dt)
          // 删除成功提示：
          this.$message.success(dt.meta.msg)

          // 判断当前页面是非首页，数据只有一条，那么删除数据时，页码就需要操作递减（显示上一页的数据）
          if (this.reqParam.pagenum !== 1 && this.userList.length === 1) {
            this.reqParam.pagenum--
          }

          // 页面数据刷新：
          this.getUserList()
        })
        .catch(() => {})
    },

    // 显示需要修改用户数据对应的弹框：----------------------------
    showEditDialog (user) {
      // 显示对话框：
      this.editDialog = true
      // 参数user是被修改的用户信息对象（id/username/email/mobile/password...）
      // this.editForm = user
      this.editForm = Object.assign({}, user) // 浅拷贝一份user到一个空对象里面，然后再将这个值赋值给editForm
      // console.log(this.userList)
      // console.log(user)
    },

    // 修改用户数据的操作：收集数据：------------------------------
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          console.log(dt)
          // @close="$refs.editFormRef.clearValidate()"
          this.$refs.editFormRef.clearValidate() // 可以重置表单项的校验结果
          // 关闭弹框：
          this.editDialog = false
          // 修改成功提示：
          this.$message.success(dt.meta.msg)
          // 页面数据刷新：
          this.getUserList()
        }
      })
    },

    // 显示分配角色的弹框：----------------------------------------
    async showAssigDialog (user) {
      // console.log(user)
      this.assigDialog = true // 弹框开启
      // 让分配角色的表单来接收user：
      this.assigForm = user
      // 获取可以分类的角色数据：
      var { data: dt } = await this.$http.get('roles')
      // console.log(dt)
      // 把拿到的角色数据赋值给roleList
      this.roleList = dt.data
    },

    // 设置分配角色数据：
    async assigUser () {
      // 校验当用户没有选择时提交，提示错误信息
      if (this.assigForm.rid === undefined) {
        this.$message.error('请选择分配角色')
      } else {
        // 否则用户选择角色后提交就发送axios请求，将数据put到数据库中
        var { data: dt } = await this.$http.put('users/' + this.assigForm.id + '/role', { rid: this.assigForm.rid })
        // console.log(dt)
        this.$refs.assigFormRef.clearValidate() // 可以重置表单项的校验结果
        // 关闭弹框：
        this.assigDialog = false
        // 成功消息提示：
        this.$message.success(dt.meta.msg)
        // 页面刷新：
        this.getUserList()
      }
    },

    // 修改状态按钮：
    async modState (uid, state) {
      // console.log(uid, state)
      var { data: dt } = await this.$http.put('users/' + uid + '/state/' + state)
      // console.log(dt)
      this.$message.success(dt.meta.msg)
      this.getUserList()
    }
  },

  // 设置监听器，监听data成员变化---------------------------------
  watch: {
    // 监听添加用户名的input框内容变化的事件：
    'addForm.username': function (newval) {
      // console.log(newval, oldval)
      if (newval.trim().length > 2) {
        // console.log(this.$refs.mypass)
        this.$refs.myname.getInput().style.border = '2px solid green'
      } else if (newval.trim().length === 0) {
        this.$refs.myname.getInput().style.border = '2px solid #DCDFE6'
      } else {
        this.$refs.myname.getInput().style.border = '2px solid red'
      }
    },

    // 监听添加密码的input框内容变化的事件：
    'addForm.password': function (newval) {
      // console.log(newval, oldval)
      if (newval.trim().length < 6) {
        // console.log(this.$refs.mypass)
        this.$refs.mypass.getInput().style.border = '2px solid red'
      } else {
        this.$refs.mypass.getInput().style.border = '2px solid green'
      }
    }

    // 因为手机和邮箱的校验规则比较复杂，所以校验规则不能通过watch监听器来控制
    /* 'addForm.email': function (newval) {
      // console.log(newval, oldval)
      if (newval.trim().length > 0) {
        // console.log(this.$refs.mypass)
        this.$refs.myemail.getInput().style.border = '1px solid green'
      } else {
        this.$refs.myemail.getInput().style.border = '1px solid red'
      }
    }, */

    /* 'addForm.mobile': function (newval) {
      // console.log(newval, oldval)
      if (newval.trim().length > 11) {
        // console.log(this.$refs.mypass)
        this.$refs.mymobile.getInput().style.border = '1px solid green'
      } else {
        this.$refs.mymobile.getInput().style.border = '1px solid red'
      }
    } */
  }

}
</script>

<style lang="less" scoped>
</style>
