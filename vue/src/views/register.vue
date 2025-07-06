<template>
  <div class="register">
    <el-row class="login-content">
      <el-col :xs="0" :md="13" class="login-banner">
        <img src="@/assets/images/login-banner.png" alt="Login Banner" style="width:65%;height:65%;object-fit:cover;padding-top:90px;">
      </el-col>
      <el-col :xs="13" :md="3" class="login-form-container">
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form"
          style="z-index: 1000;">
          <div style="width: 100%; height: 200px; text-align: center; padding: 55px; font-family: '微软雅黑'">
            <div style="font-size: 42px; padding-top: 40px; width: 300px; margin: 0 auto">
              <div style="float: left; margin-top: 13px; width: 200px; text-align: center">
                <div>IoT</div>
                <div style="letter-spacing: 1.5px; font-size: 20px; font-weight: 600; margin-top: -8px; margin-left: 3px">物联网平台</div>
              </div>
            </div>
          </div>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="phonenumber">
            <el-input v-model="registerForm.phonenumber" type="text" auto-complete="off" placeholder="手机号码">
              <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码"
              @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off" placeholder="确认密码"
              @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="captchaOnOff" prop="code">
            <el-input v-model="registerForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
              @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="register-code">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button v-if="!bindAccount" :loading="loading" type="primary" style="width: 100%"
              @click.native.prevent="handleRegister">
              <span v-if="!loading">注 册</span>
              <span v-else>注 册 中...</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-link href="https://iot.yichen.link/doc" :underline="false" target="_blank"
              style="float: left; margin-left: 20px">接入文档</el-link>
            <router-link :to="{ path: '/login', query: this.$route.query }"
              style="float: left; margin-left: 20px">账号登录</router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--  底部  -->
    <div class="el-register-footer">
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
import { getCodeImg, checkBindId, bindRegister } from '@/api/login';
import { register } from '@/api/iot/tool';

export default {
  name: 'Register',
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      logo,
      codeUrl: '',
      registerForm: {
        username: '',
        phonenumber: '',
        password: '',
        confirmPassword: '',
        code: '',
        uuid: '',
        bindId: '',
      },
      registerRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入您的账号',
          },
          {
            min: 2,
            max: 20,
            message: '用户账号长度必须介于 2 和 20 之间',
            trigger: 'blur',
          },
        ],
        phonenumber: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入您的手机号码',
          },
          {
            min: 11,
            max: 11,
            message: '手机号码长度为11',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入您的密码',
          },
          {
            min: 5,
            max: 20,
            message: '用户密码长度必须介于 5 和 20 之间',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/
              if (!passwordreg.test(value)) {
                callback(new Error('密码须由大写,小写字母,数字,特殊符中的2种及以上类型组成'))
              }
              else {
                callback()
              }
            }
          },
        ],
        confirmPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '请再次输入您的密码',
          },
          {
            required: true,
            validator: equalToPassword,
            trigger: 'blur',
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
      captchaOnOff: true,
      bindAccount: false,
    };
  },
  created() {
    this.checkBind();
    this.getCode();
  },
  methods: {
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
            this.registerForm.bindId = bindId;
          } else {
            this.registerForm.bindId = '';
            this.$router.push({
              query: {},
            });
          }
        });
      }
    },

    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    qqLogin() {
      window.location.href = 'http://localhost:8080/auth/render/qq';
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
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.bindAccount) {
            bindRegister(this.registerForm)
              .then((res) => {
                this.innerRegister(res);
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaOnOff) {
                  this.getCode();
                }
              });
          } else {
            register(this.registerForm)
              .then((res) => {
                this.innerRegister(res);
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaOnOff) {
                  this.getCode();
                }
              });
          }
        }
      });
    },
    innerRegister(res) {
      const username = this.registerForm.username;
      this.$alert("<font color='red'>恭喜你，您的账号 " + username + ' 注册成功！</font>', '系统提示', {
        dangerouslyUseHTMLString: true,
        type: 'success',
      })
        .then(() => {
          this.$router.push('/login');
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss">
.register {
  height: 100%;
  overflow: auto;
}

.register-form {
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

.register-code {
  width: 33%;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 3px;
    height: 38px;
  }
}

.el-register-footer {
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
