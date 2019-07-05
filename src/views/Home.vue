<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/logo.png" alt />
        <span>VUE后台管理项目</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="fold?'65px':'200px'">
        <div class="toggle_bar" @click="fold=!fold">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="fold"
          :collapse-transition="false"
        >
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''" :style="{width:fold?'65px':'200px'}">
            <template slot="title">
              <i :class="'iconfont icon-'+iconList[item.path]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item.id+'-'+item2.id">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <!-- welcome第三级别业务组件的占位符 -->
        <!-- <router-view></router-view> -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在生命周期（创建完毕阶段）来获取菜单的数据
  created () {
    // 这里需要校验axios发送请求是否有携带token过来
    this.getMenuList()
  },
  methods: {
    // 退出功能按钮：清除token
    logout () {
    // 退出确认弹框：
      this.$confirm('确认退出系统登录吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token：
        window.sessionStorage.clear()
        // push根据路由地址显示对应组件
        this.$router.push('/login')
      }).catch(() => {})
    },
    // 获取菜单的数据来渲染菜单导航
    async getMenuList () {
      // 使用axios发送请求具体的url地址，获取对应的数据
      // 对象解构赋值重命名：var { data: dt }
      var { data: dt } = await this.$http.get('menus')
      console.log(dt)
      // 数据获取失败的处理（报错）
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把得到的数据渲染给menuList菜单列表：
      this.menuList = dt.data
    }
  },
  data () {
    return {
      // 设置菜单是否折叠：false（展开）、true（折叠）
      fold: false,
      // 设置菜单列表：
      menuList: [],
      // 给一级菜单定义差异化的小图标（根据data数据里的path的内容）
      iconList: {
        // 菜单数据path字段：图标标志信息
        users: 'users',
        rights: 'tijikongjian',
        goods: 'shangpin',
        orders: 'danju',
        reports: 'baobiao'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .toggle_bar{
    height: 25px;
    background: #4a5064;
    text-align: center;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
    user-select: none;
    cursor: pointer;
    letter-spacing: .1rem /* 5/50 */;
  }
  .el-header {
    background-color: #373d41;
    padding: 0;
    display: flex;
    align-items: center;
    // 弹性布局：水平方向容器与容器之间留空白
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 20px;
    .logo-box {
      color: #fff;
      font-size: 22px;
      user-select: none;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
