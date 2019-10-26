<template>
  <!-- <div>这是index</div> -->
  <!-- <div class="index">  -->
    <el-container class="index">
      <el-header>
        <!-- Header -->
        <div class="logo">
          <img src="../assets/logo1.png" alt="">
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logoout">
          他大姨妈~
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
      router
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
       <el-submenu index="1">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 解析时, 会将配置的路径, 当成绝对路径使用, 写的是users => /users -->
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
    <el-submenu index="2">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <!-- 解析时, 会将配置的路径, 当成绝对路径使用, 写的是users => /users -->
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
      </el-menu>
    </el-aside>
     <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
  <!-- </div> -->
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('确定退出该系统么?', '提示', {
        type: 'warning'
      }).then(() => {
        // 销毁本地token
        localStorage.removeItem('token')
        console.log(localStorage.getItem('token'))
        this.$router.push('/login')
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .index{
    // width: 100%;
    height: 100%;
    .el-header{
      // height: 60px;
      background-color: #d8d8d8;
      display: flex;
      .logo{
        width: 180px;
        // margin: 10px;
        img{
          height: 40px;
          margin: 10px;
        }
      }
      .title{
        flex: 1;
        text-align: center;
        line-height: 60px;
        color: #545c64;
      }
      .logoout{
        width: 180px;
        line-height: 60px;
        text-align: right;
        font-weight: 700;
        a{
          color: orchid;
          text-decoration: none;
        }
      }
    }
    .el-aside {
      background-color:#545c64 ;
      .el-menu{
        border: 0px solid #000;
      }
    }
     .el-main {
    background-color: #ecf0f1;
  }
  }
</style>
