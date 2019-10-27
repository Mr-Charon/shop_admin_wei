<template>
  <div class="login">
    <el-form ref="form" :model="form"  :rules="rules" status-icon label-width="80px">
      <img class="login" src="../assets/login.jpg" alt="">
      <el-form-item label="用户名" prop='username'>
        <el-input v-model="form.username" placeholder='请输入用户名'></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input v-model="form.password" type='password' placeholder='请输入密码'></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click='reset'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '密码长度必须是3-12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      // 获取到表单组件
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        // 通过校验了, 该发ajax了
        const { meta, data } = await
        // 简写形式
        this.$axios.post('login', this.form)
        if (meta.status === 200) {
          // 消失提示框
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          localStorage.setItem('token', data.token)
          // 跳转到index
          this.$router.push('/index')
        } else {
          console.log(meta.msg)
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
 .login{
   width: 100%;
   height: 100%;
   overflow: hidden;
   background-color: #2d434c;
   .el-form{
     background-color: #fff;
     width:400px;
     margin: 0 auto;
     margin-top: 200px;
     padding: 20px;
     padding-top: 70px;
     border-radius: 20px ;
     position: relative;
    .login{
       width: 120px;
       height: 120px;
       position: absolute;
       left: 50%;
       transform:translateX(-50%);
       top: -60px;
       border: 5px solid #fff;
       border-radius: 50%;
     }
     .loginBtn{
       margin-right: 80px;
     }
   }
 }
</style>
