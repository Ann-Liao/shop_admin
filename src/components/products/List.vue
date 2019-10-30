<template>
  <div class="list">
    <el-button @click="goToGoogdsAdd" class="addBtn" type="success" plain>添加商品</el-button>
    <el-table :data="goodsList">
      <el-table-column type="index" :index="indexHandler"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" >
        <template v-slot:default="{row}">
          <span>{{ row.add_time | format}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品操作">
        <template v-slot:default=" { row }">
          <el-button size="small" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="small" type="danger" plain icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      queryStr: {
        Pnp: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: this.queryStr
      })
      if (meta.status === 200 || meta.status === 201) {
        this.goodsList = data.goods
        this.total = data.total
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.queryStr.pagesize = val
      this.queryStr.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.queryStr.pagenum = val
      this.getGoodsList()
    },
    goToGoogdsAdd () {
      this.$router.push('/goods-add')
    },
    indexHandler (index) {
      return index + 1 + (this.queryStr.pagenum - 1) * this.queryStr.pagesize
    }
  }
}
</script>

<style lang="less" scoped>
.list{
  .addBtn{
    margin-bottom: 10px;
  }
}

</style>
