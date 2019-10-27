<template>
 <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button class="addRoles" type='success' plain>添加角色</el-button>
    <!-- 表格 -->
  <el-table :data="RolesList">
      <!-- 里面的树形 -->
       <el-table-column type='expand'>
       <template v-slot:default="{row}">
         <!-- 一级 -->
         <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
           <!-- 左侧 -->
           <el-col :span="4">
             <el-tag closable @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
               <i class="el-icon-arrow-right"></i>
           </el-col>
          <!-- 右侧 -->
          <el-col :span='20'>
            <!-- 每个二级都应该是一行 -->
            <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
              <el-col :span="4">
                 <el-tag closable @close="delRight(row,l2.id)" type='success'>{{l2.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 每个三级就是一个el-tag -->
               <el-col :span="20">
                 <el-tag closable @close="delRight(row,l3.id)" type="warning" class='l3' v-for='l3 in l2.children'
                 :key="l3.id">{{l3.authName}}</el-tag>
               </el-col>
            </el-row>
          </el-col>
         </el-row>
       </template>

       </el-table-column>
     <!-- 其他内容 -->
       <el-table-column type='index'></el-table-column>
       <el-table-column label='角色名称'
       prop='roleName'></el-table-column>
       <el-table-column label='描述' prop='roleDesc'></el-table-column>
       <el-table-column label='操作'>
        <template v-slot:default="{row}">
          <el-button type='primary' plain icon='el-icon-edit' size='small'></el-button>
          <el-button type='danger' plain icon='el-icon-delete' size='small'></el-button>
          <el-button type='success' plain icon='el-icon-check' size='small'>分配角色</el-button>
        </template>
       </el-table-column>
     </el-table>
 </div>
</template>

<script>
export default {
  data () {
    return {
      RolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有数据
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.RolesList = data
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击每一个可以删除
    async delRight (row, rightId) {
      const { meta, data } = await
      this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        // console.log(data)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
 .roles{
    .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .addRoles{
    margin-bottom: 10px;
  }
  .l1{
    padding: 10px 0;
    border-bottom: 1px dotted #fff;
    &:last-child {
      border-bottom: none;
    }
  }
  .l2{
    margin-bottom: 5px;
  }
  .l3{
    margin-right: 5px;
    margin-bottom: 5px;
  }
 }
</style>
