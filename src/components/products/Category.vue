<template>
  <div class="category">
    <el-button @click="showDialog('add')" class="addBtn" type="success" plain>添加分类</el-button>
    <el-table row-key="cat_id" lazy
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"  :data="cateList">
      <el-table-column  label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效" >
        <template v-slot:default="{row}">
          <span v-show="row.cat_deleted === false">是</span>
          <span v-show="row.cat_deleted === true">否</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作" >
        <template v-slot:default="{row}">
         <el-button @click="showDialog('edit',row.cat_id)" type="primary" plain size="small" icon="el-icon-edit"></el-button>
         <el-button @click="delCate(row.cat_id)" type="danger" plain size="small" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="queryStr.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryStr.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog @close="closeDialog" :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item v-show="dialogTitle==='添加分类'" label="父级名称">
          <el-cascader v-model="value" :options="options" :props="{checkStrictly:true,...defaultParams}" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span  class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit" type="primary" >确 定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      options: [],
      defaultParams: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateList: [],
      queryStr: {
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      form: {
        cat_name: '',
        cat_id: 0
      },
      dialogTitle: '',
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入正确的分类名', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getOptions()
    this.getCateList()
  },
  methods: {
    async getOptions () {
      const { meta, data } = await this.$axios.get('categories',
        { params: { type: 2, pagenum: 1, pagesize: 4 } })
      if (meta.status === 200 || meta.status === 201) {
        this.options = data.result
      } else {
        this.$message.error(meta.msg)
      }
    },
    async getCateList () {
      const { meta, data } = await this.$axios.get('categories', {
        params: this.queryStr
      })
      if (meta.status === 200 || meta.status === 201) {
        this.cateList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.queryStr.pagesize = val
      this.queryStr.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.queryStr.pagenum = val
      this.getCateList()
    },
    async delCate (id) {
      try {
        await this.$confirm('你确定要删除这个分类吗？', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`categories/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.cateList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getOptions()
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showDialog (type, id) {
      this.dialogVisible = true
      this.dialogTitle = type === 'edit' ? '修改分类' : '添加分类'
      this.form.cat_id = id
    },
    async submit () {
      try {
        await this.$refs.form.validate()
        const isAdd = this.dialogTitle === '添加分类'
        const method = isAdd ? 'post' : 'put'
        const url = isAdd ? 'categories' : `categories/${this.form.cat_id}`
        console.log(this.value[0])
        const config = isAdd ? { cat_level: 3, cat_pid: this.value[0], cat_name: this.form.cat_name } : this.form
        const { meta } = await this.$axios[method](url, config)
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getOptions()
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script >

<style lang="less" scoped>
  .addBtn{
    margin-bottom: 10px;
    }
</style>
