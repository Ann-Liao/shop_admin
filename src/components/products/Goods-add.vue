<template>
  <div class="goodsAdd">
    <el-steps :active="active" finish-status="success">
    <el-step description="基本信息" title="步骤 1"></el-step>
    <el-step description="商品图片" title="步骤 2"></el-step>
    <el-step description="商品描述" title="步骤 3"></el-step>
  </el-steps>
   <el-tabs @tab-click="handleClick" v-model="activeTab" tab-position="left" >
    <el-tab-pane name="0" label="基本信息">
      <el-form :model="form" label-width="80px" >
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
           <el-cascader
            v-model="form.goods_cat"
            :options="options" :props="props">
            </el-cascader>
        </el-form-item>
      </el-form>
      <el-button @click="goNext" type="primary">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane name="1" label="商品图片">
      <el-upload
        action="http://localhost:8888/api/private/v1/upload"
        list-type="picture-card"
        multiple
        :headers="headers"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-button @click="goNext" type="primary">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane name="2" label="商品描述">
      <quill-editor v-model="form.goods_introduce"></quill-editor>
      <el-button @click="addGoods" type="primary">添加</el-button>
    </el-tab-pane>
  </el-tabs>

  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeTab: '0',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        authorization: localStorage.getItem('token')
      }
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
    }
  },
  methods: {
    goNext () {
      this.active++
      this.activeTab = this.active + ''
    },
    async addGoods () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',') })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleClick (tab) {
      this.active = +this.activeTab
    },
    handleRemove (file, fileList) {
      this.form.pics = this.form.pics.filter(item => item.pic !== file.response.data.tmp_path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response) {
      if (response.meta.status === 200) {
        this.$message.success(response.meta.msg)
        this.form.pics.push({ pic: response.data.tmp_path })
      } else {
        this.$message.error(response.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .goodsAdd{
   .quill-editor{
     background-color: #fff;
     /deep/ .ql-editor{
       min-height: 300px;
     }
   }
 }

</style>
