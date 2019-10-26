<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item >用户管理</el-breadcrumb-item>
  <el-breadcrumb-item >用户列表</el-breadcrumb-item>
</el-breadcrumb>
  <div class="search">
    <el-input v-model="query" placeholder="请输入内容"  class="input-with-select">
    <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
  </el-input>
  <el-button class="addBtn" type="success" plain >添加用户</el-button>
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
    async getUserList () {
      const { data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      this.userList = data.users
      this.total = data.total
    },
    async del (id) {
      try {
        await this.$confirm('您确定要删除此用户吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`/users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message(e)
      }
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async updateState (id, val) {
      const { meta } = await this.$axios.put(`users/${id}/state/${val}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
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
    .input-with-select{
    width: 300px;
    .el-input-group__append{
    padding: 0;
  }
  }

  .addBtn{
    margin-left: 20px;
  }
  }
  .el-pagination{
    margin-top: 20px;
  }
}
</style>
