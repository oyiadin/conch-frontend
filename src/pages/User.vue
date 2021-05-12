<template>
  <div class="container">
    <el-radio-group v-model="mode" class="mode-switch">
      <el-radio-button label="login">登录</el-radio-button>
      <el-radio-button label="register">注册</el-radio-button>
    </el-radio-group>
    <div class="form-login" v-if="mode === 'login'">
      <el-form ref="formLogin" :model="formLogin" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="formLogin.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLogin.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doLogin('formLogin')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-register" v-if="mode === 'register'">
      <el-form ref="formRegister" :model="formRegister" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="formRegister.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formRegister.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者ID">
          <el-input v-model="formRegister.author_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doRegister('formRegister')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import md5 from "md5";

export default {
  name: "User.vue",
  data () {
    return {
      mode: 'login',
      formLogin: {
        email: '',
        password: '',
      },
      formRegister: {
        email: '',
        password: '',
        author_id: '',
      }
    }
  },
  methods: {
    hashPassword(password) {
      return md5(password)
    },
    doLogin() {
      axios({
        method: 'post',
        url: '/api/user/homepage',
        data: {
          email: this.formLogin.email,
          hashed_password: this.hashPassword(this.formLogin.password)
        }
      })
    },
    doRegister() {
      axios({
        method: 'put',
        url: '/api/user/homepage',
        data: {
          email: this.formRegister.email,
          hashed_password: this.hashPassword(this.formRegister.password),
          author_id: this.formRegister.author_id,
        }
      })
    }
  }
}
</script>

<style scoped>
.mode-switch {
  margin-bottom: 1em;
  text-align: center;
}
</style>