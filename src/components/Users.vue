<template>
  <div class="user">
    <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searUser"></el-button>
      </el-input>
    <el-button class="addBtn" plain type="success" @click="showEdit">添加用户</el-button>
    <!-- 添加弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @close = "closeDialog"
      width="40%"
     >
     <el-form  :rules='rules' ref='form' :model='form' label-width="80px">
        <el-form-item label="用户名"  prop='username'>
          <el-input v-model="form.username" placeholder='请输入用户名'></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="form.password" type='password' placeholder='请输入密码'></el-input>
        </el-form-item>
           <el-form-item label="邮箱"  prop='email'>
          <el-input v-model="form.email" placeholder='请输入邮箱'></el-input>
        </el-form-item>
           <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="form.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹框 -->
     <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="40%"
     >
     <el-form  :rules='rules' ref='editForm' :model='editForm' label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder='请输入邮箱'></el-input>
        </el-form-item>
           <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editForm.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data=userList>
      <!-- lable列的标题 -->
      <el-table-column label='姓名' prop='username'></el-table-column>
      <el-table-column label='邮箱' prop='email'></el-table-column>
      <el-table-column label='电话' prop='mobile'></el-table-column>
      <el-table-column label='用户状态'>
        <template v-slot:default='obj'>
          <!-- {{obj.row}} -->
          <el-switch
        @change="changeState(obj.row.id,obj.row.mg_state)"
        v-model="obj.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
        <el-table-column label='操作'>
          <template v-slot:default='obj'>
            <el-button plain size="small" icon="el-icon-edit" type='primary' @click="showEditDialog(obj.row)"></el-button>
            <el-button plain size="small" icon="el-icon-delete" type='danger' @click="deluser(obj.row.id)"></el-button>
            <el-button plain size="small" icon="el-icon-check" type='success'>分配角色</el-button>
          </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=" pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '', // 搜索条件
      pagenum: 1, // 第几页
      pagesize: 2, // 每页条数
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '密码长度必须是3-12位', trigger: ['change', 'blur'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['change', 'blur'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号码', rigger: ['change', 'blur'] }
        ]
      },
      editVisible: false,
      editForm: {
        id: '',
        userneme: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    async getUserList () {
      // 发送axios存储数据
      const { meta, data } =
      await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // const { meta, data } = res
      // console.log(res.data)
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
        // console.log(this.userList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 修改每页条数
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
      // console.log(`每页 ${val} 条`)
    },
    // 页面变化
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
      // console.log(`当前页: ${val}`)
    },
    // 删除
    async deluser (id) {
      // console.log(id)
      try {
        await this.$confirm('亲亲，确定要删除么？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          // 如果当前页只有一条，删除仅有的一条后，当前页减1
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 搜索
    searUser () {
      this.pagenum = 1
      this.getUserList()
    },
    // 用户状态变化
    async changeState (id, flag) {
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
      // const { meta } = res
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示添加弹框
    showEdit () {
      this.dialogVisible = true
    },
    async addUser () {
      try {
        // 进行表单校验
        await this.$refs.form.validate()
        // 等待结果，校验成功发送ajax
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          // 成功提示消息
          this.$message.success(meta.msg)
          // 关闭对话框
          this.dialogVisible = false
          // 将当前页更新为最后一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 重置表单
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 点击修改数据还原
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 修改数据发送Ajax
    async editUser () {
      try {
        // 表单校验
        await this.$refs.editForm.validate()
        // 检验通过发送Ajax
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          // 成功提示
          this.$message.success(meta.msg)
          // 关闭模态框
          this.editVisible = false
          // 重新渲染
          this.getUserList()
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
 .user{
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .input-with-select{
    width: 300px;
    margin-bottom: 10px;
    }
  .addBtn{
      margin:0 20px;
    }
 }
</style>
