<template>
  <div class="user">
    <el-table :data=userList>
      <!-- lable列的标题 -->
      <el-table-column label='姓名' prop='username'></el-table-column>
      <el-table-column label='邮箱' prop='email'></el-table-column>
      <el-table-column label='电话' prop='mobile'></el-table-column>
      <el-table-column label='用户状态'>
        <template v-slot:default='obj'>
          <!-- {{obj.row}} -->
          <el-switch
        v-model="obj.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label='操作'>
        <el-button plain size="small" icon="el-icon-edit" type='primary'></el-button>
        <el-button plain size="small" icon="el-icon-delete" type='danger'></el-button>
        <el-button plain size="small" icon="el-icon-check" type='success'>分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '', // 搜索条件
      pagenum: 1, // 第几页
      pagesize: 4// 每页条数
    }
  },
  methods: {
    getUserList () {
      // 发送axios存储数据
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        const { meta, data } = res.data
        console.log(res.data)
        if (meta.status === 200) {
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  }

}
</script>

<style>

</style>
