<template>
 <div class="rights">
   <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
     <el-table :data='rightsList'>
       <el-table-column type='index'></el-table-column>
       <el-table-column label='权限名称' prop='authName'></el-table-column>
       <el-table-column label='路径' prop='path'></el-table-column>
       <el-table-column label='层级'>
         <template v-slot:default='{row}'>
           <span v-if="row.level==='0'">一级</span>
           <span v-if="row.level==='1'">二级</span>
          <span v-if="row.level==='2'">三级</span>
         </template>
       </el-table-column>
     </el-table>
 </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async  getRightsList () {
      // 进入页面刷新页面
      const { meta, data } = await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.rightsList = data
        // console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
 .rights{
    .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
 }
</style>
