<template>
<div class="login">
  <el-form status-icon :rules="rules" ref="form" :model="form" label-width="80px">
    <img src="../assets/01.jpg" class="logo" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" placeholder="please enter username or email"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="form.password" placeholder="please enter password"></el-input>
  </el-form-item>
   <el-form-item >
    <el-button @click="login" type="primary" class="submit">登录</el-button>
    <el-button @click="reset" class="reset">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'username is required', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: 'length should be between 3-12', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: 'password is needed', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: 'password is between 3-12', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          localStorage.setItem('token', data.token)
          this.$router.push('/index')
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

<style lang="less" >

  .login{
     width: 100%;
     height: 100%;
    background-color: #2d434c;
    overflow: hidden;
    .el-form{
      width: 400px;
      padding: 20px;
      padding-top: 70px;
      border-radius: 20px;
      background-color: #fff;
      margin: 0 auto;
      margin-top: 100px;
      position: relative;
      .reset{
        margin-left: 70px;
      }
      .logo{
        width: 120px;
        border-radius: 50%;
        border: 5px solid #fff;
        position: absolute;
        left:  50%;
        transform: translateX(-50%);
        top: -70px;
      }
    }
  }

</style>
