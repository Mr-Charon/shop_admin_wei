<template>
  <div class="goods">
    <!-- 这是商品列表页 -->
    <!-- 添加按钮 -->
   <el-button type='success' plain class="addGoods">添加商品</el-button>
   <!-- 表格 -->
   <el-table :data='goodsList'>
       <el-table-column type='index'></el-table-column>
       <el-table-column label='商品名称' prop='goods_name'></el-table-column>
       <el-table-column label='商品价格' prop='goods_price'></el-table-column>
       <el-table-column label='商品重量' prop='goods_weight'></el-table-column>
       <el-table-column label='创建时间' prop='add_time'></el-table-column>
       <el-table-column label='操作' prop='path'></el-table-column>
     </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      Pnp: '',
      pagenum: 1,
      pagesize: 4
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 表格数据渲染
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods')
      if (meta.status === 200) {
        console.log(data)

        this.goodsList = data
      }
    }
  }

}
</script>

<style lang='scss' scoped>
  .goods{
    .addGoods{
      margin-bottom: 10px;
    }
  }
</style>
