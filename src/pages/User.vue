<template>
  <div class="container">
    <el-radio-group v-model="mode" class="mode-switch" size="mini">
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
          <el-input v-model="formRegister.author_id" autocomplete="off"
                    @click="onShowSearchAuthorIdDialog"
                    readonly
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doRegister('formRegister')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="搜索并绑定你的作者身份" v-model="showSearchAuthorIdDialog">
      <div class="dialog-tips">
        <el-alert type="info">
          <template #default>
            <div class="dialog-tips-body">
              <div>步骤1：输入任意一篇您已发表的文献的标题</div>
              <div>步骤2：按下回车以进行搜索</div>
              <div>步骤3：在作者处找到您的姓名并点击选择</div>
            </div>
          </template>
        </el-alert>
      </div>
      <el-input v-model="queryStr" placeholder="请搜索您已发表文献的标题"
                @keyup.enter="getQueryResults"></el-input>
      <el-divider></el-divider>
      <ul class="query-results">
        <li v-for="record in authorRecords" :key="record._id">
          <div class="record-title">
            <router-link :to="{ name: 'record', params: {key: record._id}}">
              {{ record.title }}
            </router-link>
          </div>
          <div class="record-authors">
            <el-button @click="setAuthorIdAndCloseDialog(author.ids[0])"
                       v-for="author in record.authors" :key="author.name"
                       type="text"
            >
              {{ author.name }}
            </el-button>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import md5 from "md5";
import {ElMessage} from "element-plus";

export default {
  name: "User.vue",
  created () {
    document.title = '用户中心 - 个性化文献推荐系统'
  },
  data () {
    return {
      mode: 'login',
      showSearchAuthorIdDialog: false,
      authorRecords: [],
      queryStr: '',
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
          .then(() => {
            window.location.href = '/'
          })
          .catch((reason) => {
            ElMessage.error("登录失败：" + reason)
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
          .then(() => {
            window.location.href = '/'
          })
          .catch((reason) => {
            ElMessage.error("注册失败：" + reason)
          })
    },
    onShowSearchAuthorIdDialog(e) {
      e.target.blur()
      this.showSearchAuthorIdDialog = true
    },
    getQueryResults() {
      axios.post('/api/search/record',
          null,
          {params: {'query_str': this.queryStr}})
          .then(resp => {
            this.authorRecords = resp.data.records
          })
    },
    setAuthorIdAndCloseDialog(authorId) {
      this.formRegister.author_id = authorId
      this.showSearchAuthorIdDialog = false
    }
  }
}
</script>

<style scoped>
.mode-switch {
  display: block;
  margin-bottom: 15px;
  text-align: center;
}
.query-results {
  list-style: none;
  padding: 0;
  margin: 0;
}
.query-results li {
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid black;
}
.query-results li:hover {
  background-color: #f0f0f0;
}
.query-results li * {
  color: #2c3e50 !important;
}
.query-results li a {
  text-decoration: none;
}
.record-title {
  font-weight: bold;
}
.record-authors button:after {
  content: ', ';
}
.record-authors button:last-child:after {
  content: '';
}
.record-authors a:hover {
  text-decoration: underline;
}
.dialog-tips {
  margin-bottom: 10px;
}
.dialog-tips-body {
  margin: 0 auto;
}
</style>

<style>
.el-dialog__body {
  padding-top: 0;
}
.el-button+.el-button {
  margin-left: 0 !important;
}
</style>