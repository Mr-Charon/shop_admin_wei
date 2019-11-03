<template>
  <div class="goods">
    <!-- 这是商品列表页 -->
    <!-- 添加按钮 -->
   <el-button type='success' plain class="addGoods" @click="goodsAdd">添加商品</el-button>
   <!-- 表格 -->
    <el-table :data='goodsList'>
       <el-table-column type='index' :index="indexMethod"></el-table-column>
       <el-table-column label='商品名称' prop='goods_name'></el-table-column>
       <el-table-column label='商品价格' prop='goods_price'></el-table-column>
       <el-table-column label='商品重量' prop='goods_weight'></el-table-column>
       <el-table-column label='创建时间' prop='add_time'>
         <template v-slot:default='{row}'>
           {{row.add_time|time}}
         </template>
       </el-table-column>
       <el-table-column label='操作'>
        <el-button type='primary' plain icon='el-icon-edit' size='small'>
        </el-button>
        <el-button type='danger' plain icon='el-icon-delete' size='small'>
        </el-button>
       </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 15, 20,25 ]"
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
      goodsList: [],
      Pnp: '',
      pagenum: 1,
      pagesize: 4,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 表格数据渲染
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods',
        {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
      if (meta.status === 200) {
        // console.log(data)
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分页
    // 切换条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    // 序号问题
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    // 添加商品
    goodsAdd () {
      this.$router.push('goods-add')
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
