<template>
  <el-container class="index">
  <el-header>
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <div class="center">
      <h1>电商后台管理系统</h1>
    </div>
    <div class="logout">
      欢迎光临~ <a @click="logout" href="javascript:;">退出</a>
    </div>
  </el-header>
  <el-container>
    <el-aside width="200px">
       <el-menu router unique-opened :default-active="currentPath"  class="el-menu-vertical-demo"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu v-for="item in rightList" :key="item.id" :index="item.path">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item.authName}}</span>
        </template>
        <el-menu-item v-for="value in item.children" :key="value.id" :index="value.path">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ value.authName}}</span>
      </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  computed: {
    currentPath () {
      return this.$route.path.slice(1)
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.rightList = data
      console.log(data)
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('Are you sure to exit the system?', 'Notice', {
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        this.$message(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.index{
  height: 100%;
  .el-header{
    background-color: #d8d8d8;
    display: flex;
    .logo{
      width: 180px;
      img{
        height: 40px;
        margin-top: 10px;
      }
    }
    .center{
      flex: 1;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #545c64;
    }
    .logout{
      width: 180px;
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      text-align: right;
      a{
        color: orange;
      }
    }
  }
  .el-aside{
    background-color: #545c64;
    .el-menu{
      border: none;
    }
  }
  .el-main{
    background-color: #ecf0f1;
  }
}
</style>
