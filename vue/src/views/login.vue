<template>
  <div class="login">
    <el-row class="login-content">
      <el-col :xs="0" :md="12" class="login-banner">
        <img src="@/assets/images/login-banner.png" alt="Login Banner" style="width:60%;height:60%;object-fit:cover;padding-top:90px;">
      </el-col>

      <el-col :xs="12" :md="3" class="login-form-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item>
            <div class="alert-box-wrap" v-if="loginForm.bindId != null">
              <div v-if="loginForm.bindId != null" class="alert-message-wrap">
                <i class="el-icon-warning" />
                如果你已经有账号,请直接输入账号进行绑定，
              </div>
              <el-row>
                <el-col :span="10.5">
                  <div v-if="loginForm.bindId != null" class="alert-message-wrap">
                    如果还没有账号，请先去</div>
                </el-col>
                <!-- <el-col :span="4"> -->
                <router-link v-if="loginForm.bindId != null" :to="{ path: '/register', query: this.$route.query }"
                  style="margin-left: 10px; font-size: 14px; font-family: '微软雅黑'; color: rgba(41, 96, 197, 0.856);">
                  注册
                </router-link>
                <!-- </el-col> -->
              </el-row>
            </div>
          </el-form-item>
          <div style="width: 100%; height: 200px; text-align: center; padding: 15px; font-family: '微软雅黑'">
            <div style="font-size: 42px; padding-top: 40px; width: 300px; margin: 0 auto">
              <div style="float: left; margin-top: 13px; width: 200px; text-align: center">
                <div>IoT</div>
                <div style="letter-spacing: 1.5px; font-size: 20px; font-weight: 600; margin-top: -8px; margin-left: 3px">物联网平台</div>
              </div>
            </div>
          </div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
              @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="password" class="input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="captchaOnOff" prop="code">
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
              @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="validCode" class="input-icon" />
            </el-input>

            <div class="login-code">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px; color: #000">记住密码</el-checkbox>

          <el-form-item style="width: 100%">
            <div style="margin-bottom: 10px">
              <el-button v-if="!bindAccount" :loading="loading" type="primary" style="width: 100%"
                @click.native.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </div>
            <el-row>
              <div>
               <el-link href="https://iot.yichen.link/doc" :underline="false" target="_blank" style="float: left; margin-left: 20px">接入文档</el-link>
               <router-link v-if="!bindAccount" :to="{ path: '/register', query: this.$route.query }"
                  style="float: left;margin-left:20px;">注册账号</router-link>
              </div>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>
        Copyright © 2023-2025
        <a target="_blank" href="https://yichen.link">YICHEN</a>
        All Rights Reserved.
      </span>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import logo from '@/assets/logo/logo.png';
import { getCodeImg, checkBindId, getErrorMsg, socialLogin, bindLogin } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { setToken } from '@/utils/auth';

export default {
  name: 'Login',
  data() {
    return {
      logo,
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
        bindId: '',
        // loginId: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入您的账号',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入您的密码',
          },
        ],
        code: [
          {
            required: true,
            trigger: 'change',
            message: '请输入验证码',
          },
        ],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      bindAccount: false,
      // 注册开关
      register: true,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    const loginId = this.$route.query.loginId;
    if (loginId === undefined || loginId === null) {
      this.checkBind();
      this.getCode();
      this.checkErrorMsg();
      this.getCookie();
    } else {
      this.redirectSocialLogin(loginId);
    }
  },
  methods: {
    redirectLogin(loginId) {
      this.loading = true;
      this.$store
        .dispatch('RedirectLogin', loginId)
        .then(() => {
          this.$router
            .push({
              path: this.redirect || '/',
            })
            .catch(() => { });
        })
        .catch(() => {
          this.loading = false;
          if (this.captchaOnOff) {
            this.getCode();
          }
          this.$router.push({
            query: {},
          });
        });
    },
    redirectSocialLogin() {
      const query = this.$route.query;
      const loginId = query.loginId;
      socialLogin(loginId).then((res) => {
        // 保存token
        this.loading = true;
        setToken(res.token);
        this.$router
          .push({
            path: this.redirect || '/',
          })
          .catch(() => { });
        if (this.captchaOnOff) {
          this.getCode();
          this.loading = false;
        }
      });
    },
    checkBind() {
      const query = this.$route.query;
      const bindId = query.bindId;
      if (bindId === undefined || bindId === null) {
        this.bindAccount = false;
      } else {
        this.bindAccount = true;
        checkBindId(bindId).then((res) => {
          this.bindAccount = res.bindAccount === undefined ? true : res.bindAccount;
          if (this.bindAccount) {
            this.loginForm.bindId = bindId;
          } else {
            this.loginForm.bindId = '';
            this.$router.push({
              query: {},
            });
          }
        });
      }
    },
    checkErrorMsg() {
      const errorId = this.$route.query.errorId;
      if (errorId !== undefined && errorId !== null) {
        getErrorMsg(errorId)
          .then((res) => { })
          .catch((err) => {
            this.$router.push({ query: {} });
            console.log(err);
          });
      }
    },
    getCode() {
      getCodeImg().then((res) => {
        //this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        this.captchaOnOff = res.captchaEnabled;
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      const loginId = Cookies.get('loginId');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        loginId: loginId === undefined ? this.loginForm.loginId : loginId,
      };
    },
    qqLogin() {
      window.location.href = 'http://localhost:8080/auth/render/qq';
    },
    weChatLogin() {
      const baseURL = process.env.VUE_APP_BASE_API;
      window.location.href = baseURL + '/auth/render/wechat_open_web';
    },
    authLogin() {
      this.$alert('第三方登录正在集成中...', '提示消息', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message({
            type: 'info',
            message: `action: ${action}`,
          });
        },
      });
    },
    handleBind() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, {
              expires: 30,
            });
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.loginForm.bindId = this.$route.query.bindId;
          bindLogin(this.loginForm)
            .then((res) => {
              // 保存token
              setToken(res.token);
              this.$router
                .push({
                  path: '/',
                })
                .catch(() => { });
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.loading = false;
                this.getCode();
              }
            });
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, {
              expires: 30,
            });
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router
                .push({
                  path: this.redirect || '/',
                })
                .catch(() => { });
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login {
  height: 100%;
  overflow: auto;
}

.bindAccountTitle {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #333;
  font-size: 24px;
}

.login-form {
  margin: 30px auto 0 auto;
  padding: 15px;
  z-index: 1000;
  max-width: 350px;

  input {
    height: 38px;
    background-color: #f1f1f1;
    color: #666;
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-code {
  width: 33%;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 3px;
    height: 38px;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #333;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.alert-box-wrap {
  border: 1px solid #f78e21;

  .alert-message-wrap {
    font-size: 14px;
    font-family: '微软雅黑';
    color: rgba(197, 41, 41, 0.856);
    margin-left: 10px;
  }
}

.login-content {
  display: flex;
  align-items: center;
}

.login-banner {
  display: flex;
  justify-content: right;
  align-items: right;
  overflow: hidden;
  padding: 10px;
}

.login-form-container {
  display: flex;
  justify-content: left;
  align-items: left;
  padding: 0px;
}

</style>