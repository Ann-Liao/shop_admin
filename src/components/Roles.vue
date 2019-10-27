<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item >权限管理</el-breadcrumb-item>
    <el-breadcrumb-item >角色列表</el-breadcrumb-item>
    </el-breadcrumb>
 <el-button type="success" plain class="addBtn" @click="showAddDialog">添加角色</el-button>
 <el-table :data="rolesList">
   <el-table-column type="expand">
     <template v-slot:default="{row}">
       <el-row class="l1" v-for='l1 in row.children' :key="l1.id">
         <el-col :span="4">
           <el-tag closable @close="closeTag(row, l1.id)" >{{ l1.authName }}</el-tag>
           <i class="el-icon-arrow-right"></i>
         </el-col>
         <el-col :span="20" >
           <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
             <el-col :span="4">
               <el-tag closable @close="closeTag(row, l2.id)" type="success">{{ l2.authName }}</el-tag>
               <i class="el-icon-arrow-right"></i>
             </el-col>
             <el-col :span="20"><el-tag closable @close="closeTag(row, l3.id)" class="l3" type="warning" v-for="l3 in l2.children" :key="l3.id">{{ l3.authName }}</el-tag></el-col>
           </el-row>
         </el-col>
       </el-row>
    </template>
   </el-table-column>
   <el-table-column type="index"></el-table-column>
   <el-table-column label="角色名称" prop="roleName"></el-table-column>
   <el-table-column label="描述" prop="roleDesc"></el-table-column>
   <el-table-column label="操作">
     <template v-slot:default="{ row }">
       <el-button @click="showEditDialog(row)" type="primary" plain size="small" icon='el-icon-edit'></el-button>
     <el-button @click="delRole(row.id)" type="danger" plain size="small" icon='el-icon-delete'></el-button>
     <el-button type="success" plain size="small" icon='el-icon-check'>分配权限</el-button>
     </template>
   </el-table-column>
 </el-table>
 <el-dialog @open="closeDialog" :title="dialogTitle" :visible.sync="editVisible" width="40%">
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="角色名称" prop="rolename">
      <el-input v-model="form.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roledesc">
      <el-input v-model="form.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <template v-slot:footer>
    <span class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
  </template>
 </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      editVisible: false,
      form: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },
      dialogTitle: '',
      rules: {
        rolename: [
          { required: true, message: '请输入正确的角色名称', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度为3-12', trigger: ['blur', 'change'] }
        ],
        roledesc: [
          { required: true, message: '请输入正确的角色描述', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度为3-12', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        console.log(data)
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async closeTag (row, rightId) {
      try {
        await this.$confirm('确定要删除此权限吗', '提示', { type: 'warning' })
        const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          row.children = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      this.dialogTitle = '修改角色'
      this.editVisible = true
      this.form.roleName = row.roleName
      this.form.roleDesc = row.roleDesc
      this.form.roleId = row.id
    },
    showAddDialog () {
      this.dialogTitle = '添加角色'
      // this.form.roleName = ''
      // this.form.roleDesc = ''
      this.editVisible = true
    },
    closeDialog () {
      // this.$refs.form.resetFields()
      console.log(999)
    },
    async editRoles (row) {
      try {
        const isAdd = this.dialogTitle === '添加角色'
        const url = isAdd ? 'roles' : `roles/${this.form.roleId}`
        const method = isAdd ? 'post' : 'put'
        await this.$refs.form.validate()
        const { meta } = await this.$axios[method](url, this.form)
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('您确定要删除吗', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style style="less" scoped>

 .addBtn {
    margin-bottom: 10px;
  }
  .l1,.l2,.l3{
    margin-bottom: 5px;
  }
  .l1{
    border-bottom: 1px dotted #ccc;
  }
  .l3{
    margin-right: 5px;
  }

</style>
