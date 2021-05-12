<template>
  <div>
    <el-affix id="navbar">
      <div id="navbar-inner">
        <div id="navbar-left">
          <router-link :to="{ name: 'root' }" custom v-slot="{ navigate, href }">
            <el-link :href="href" @click="navigate">
              个性化论文推荐平台
            </el-link>
          </router-link>
        </div>
        <div id="navbar-right">
          <template v-if="hasSession">
            <el-button type="text" v-show="hasSession"
                       @click="doLogout">退出登录</el-button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'user' }" custom v-slot="{ navigate }">
              <el-button type="text" @click="navigate">登录/注册</el-button>
            </router-link>
          </template>
        </div>
      </div>
    </el-affix>
    <div id="outer-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    hasSession() {
      return document.cookie.indexOf('session') !== -1
    },
  },
  methods: {
    doLogout() {
      window.location.href = '/api/user/homepage/logout'
    }
  }
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
#outer-container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}
#navbar {
  height: 40px;
  border-bottom: 1px solid #eee;
}
#navbar-inner {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 0 20px 0;
}
#navbar-left {
  line-height: 40px;
  float: left;
}
#navbar-left a {
  color: #555;
}
#navbar-right {
  float: right;
}
</style>
