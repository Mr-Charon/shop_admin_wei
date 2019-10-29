<template>
 <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button class="addRoles" type='success' plain @click="showRoles">添加角色</el-button>
     <!-- 添加弹框 -->
    <el-dialog
      :title="diaTitle"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="40%"
     >
     <el-form  :rules='rules' ref='form' :model='form' label-width="80px">
        <el-form-item label="角色名称"  prop='roleName'>
          <el-input v-model="form.roleName" placeholder='请入角色名'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop='roleDesc'>
          <el-input v-model="form.roleDesc"  placeholder='请输入角色描述'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="RolesList">
        <!-- 里面的树形 -->
        <el-table-column type='expand'>
        <template v-slot:default="{row}">
          <p v-if="row.children.length === 0">暂无权限</p>
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
            <el-button type='primary' plain icon='el-icon-edit' size='small' @click="showEditDialog(row)"></el-button>
            <el-button type='danger' plain icon='el-icon-delete' size='small' @click="delrole(row.id,$event)"></el-button>
            <el-button type='success' plain icon='el-icon-check' @click="showassignEdit(row)" size='small'>分配权限</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分配权限的树状图 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%"
     >
      <el-tree
      :data="data"
      :props="defaultProps"
      node-key="id"
      ref='tree'
      show-checkbox
      default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">分配</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
export default {
  data () {
    return {
      RolesList: [],
      dialogVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: ['blur', 'change'] }
          // { min: 3, max: 12, message: '长度必须是3-12位', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
          // { min: 3, max: 12, message: '长度必须是3-12位', trigger: ['blur', 'change'] }
        ]
      },
      diaTitle: '',
      // 树状图
      assignVisible: false,
      data: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
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
        // console.log(data)
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
    },
    // 弹出模态框添加角色
    showRoles () {
      this.dialogVisible = true
      this.diaTitle = '添加角色'
    },
    // 修改角色
    showEditDialog (row) {
      this.dialogVisible = true
      this.diaTitle = '修改角色'
      // 数据回显
      // 使用this.$nectTick()会在下次dom更新完成后执行
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    // 关闭触发
    closeDialog () {
      // 只要一关闭dialog, element-ui 将内容重置为 初始状态 (第一次展示出来的状态)
      this.$refs.form.resetFields()
    },
    // 添加||修改角色
    async saveRole () {
      // 判断是添加还是修改
      const isAdd = this.diaTitle === '添加角色'
      // 分配路由接口
      const url = isAdd ? 'roles' : `roles/${this.form.id}`
      // 传输类型
      const method = isAdd ? 'post' : 'put'
      // const { roleName, roleDesc } = this.form
      const { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 200 || meta.status === 201) {
        // 提示成功
        this.$message.success('你真棒！')
        this.getRolesList()
        this.dialogVisible = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    async delrole (id) {
      try {
      // 弹框提示
        this.$confirm('亲亲，确定要删除么？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          // this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 弹出树状图
    async showassignEdit (row) {
      this.assignVisible = true
      this.roleId = row.id
      // 全部权限
      const { data, meta } = await this.$axios.get('rights/tree')
      const ids = []
      if (meta.status === 200) {
        this.data = data
        // console.log(data)
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async assignRights () {
      try { // 获取点击的权限
        const ids = this.$refs.tree.getCheckedKeys()
        // 半选的也要
        const halfs = this.$refs.tree.getHalfCheckedKeys()
        const rids = [...ids, ...halfs].join(',')
        const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })

        if (meta.status === 200) {
          // console.log(meta)
          this.$message.success(meta.msg)
          this.assignVisible = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
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
