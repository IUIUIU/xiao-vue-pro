<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo部分： -->
      <div class="avatar-box">
        <img src="../assets/img/jump.gif" alt />
      </div>

      <!-- form表单验证部分： -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 输入框部分： -->
        <!-- <el-form-item prop="设置表单校验时对应的校验对应的属性名"> -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮部分： -->
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="$refs.loginFormRef.resetFields()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入icon图标文件：
import '../assets/fonts/iconfont.css'

export default {
  data () {
    return {
      // 登录表单数据绑定的对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 设置表单校验：
      loginFormRules: {
        // username/password要与表单域的prop属性值一致
        username: [
          // { require: 必填规则, message: '提示信息', trigger: '触发事件' }
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 注册点击登录的事件：
    login () {
      // 表单校验：校验成功在登录跳转到home页面
      // console.log(this) // VueComponent组件对象
      // console.log(this.$refs.loginFormRef) // VueComponent组件对象（el-form）
      this.$refs.loginFormRef.validate(async valid => {
        // valid === true/false 校验成功/失败
        // console.log(valid)
        if (valid) {
          // 使用axios发送请求到服务器端与真实的数据做校验：
          // this.$http.post('login',{username:this.loginForm.username,password:this.loginForm.password})
          var { data: dt } = await this.$http.post('login', this.loginForm)
          // 对象解构赋值重命名：var { data: dt }
          console.log(dt)
          // 判断当状态码不等于200时，会有错误消息提示框弹出来（ElementUI消息提示框）
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }

          // 存储令牌：通过window.sessionStorage.setItem('token',data.data.token)
          window.sessionStorage.setItem('token', dt.data.token)

          // 判断登录成功后页面发生跳转：
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;

    .avatar-box {
      width: 130px;
      height: 130px;
      padding: 8px;
      border-radius: 50%;
      border: 1px solid #eee;
      background-color: #fff;
      // 设置边框阴影样式：
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      // 禁止用户截取页面数据：
      user-select: none;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      // 因为设置20px的内边距，input框超出去了，所以需要设置自动内减
      box-sizing: border-box;
    }
  }
}
</style>
