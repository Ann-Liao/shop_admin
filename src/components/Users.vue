<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
  <el-breadcrumb-item >用户列表</el-breadcrumb-item>
</el-breadcrumb>
  <div class="search">
    <el-input placeholder="请输入内容"  class="input-with-select">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  <el-button type="success" plain >添加用户</el-button>
  </div>
    <el-table
    :data="userList"
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="180">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话">
    </el-table-column>
    <el-table-column
      label="用户状态">
      <template v-slot:default="scope"><el-switch
      v-model="scope.row.mg_state"
      @change='updateState(scope.row.id,scope.row.mg_state)'
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch></template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template v-slot:default="scope">
        <el-button size="mini" icon="el-icon-edit" plain type="primary"></el-button>
        <el-button @click="del(scope.row.id)" size="mini" icon="el-icon-delete" plain type="danger"></el-button>
        <el-button size="mini" icon="el-icon-check" plain type="success">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>

</template>

<script>
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$axios.get('/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: { authorization: localStorage.getItem('token') }

      }).then(res => {
        console.log(res)
        this.userList = res.data.data.users
        this.total = res.data.data.total
      }).catch()
    },
    del (id) {
      this.$axios.delete(`/users/${id}`, {
        params: id,
        headers: {
          authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        this.getUserList()
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    updateState (id, val) {
      console.log(id, val)
      this.$axios.put(`users/${id}/state/${val}`)
        .then(res => {
          console.log(res)
        // this.getUserList()
        }).catch()
    }
  }

}
</script>

<style lang="less" scoped>
.users{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc
  }
  .search{
    margin-bottom: 10px;
    .el-input{
    width: 300px;
    .el-input-group__append{
    padding: 0;
  }
  }

  .el-button{
    margin-left: 20px;
  }
  }
  .el-pagination{
    margin-top: 20px;
  }
}
</style>
