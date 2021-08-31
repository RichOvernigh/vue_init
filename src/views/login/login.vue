<template>
  <div class="login">
    <div class="top-box animated bounceInDown">
      <img src="@/assets/login/+++.png" class="jia-img" alt="">
    </div>
    <div class="center-box ">
      <div class="center-bg-box animated slideInLeft">
        <img src="@/assets/login/center-bg.png" class="center-bg-box-img" alt="">
      </div>
      <div class="login-container">
        <div class="login-box">
          <img src="@/assets/login/login-bg.jpg" class="login-box-bg animated slideInRight" alt="">
          <img src="@/assets/login/login-left-bg.png" class="login-left-bg" alt="">
          <img src="@/assets/login/login-left-top-bg.png" class="login-left-top-bg" alt="">
          <img src="@/assets/login/login-logo.png" class="login-logo  animated bounceInUp" alt="">
          <div class="border animated flipInY" />
          <div class="login-title">LIVELAB报表管理系统</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >
            <div>
              <!-- <h3 class="title">LiveLab报表管理系统</h3> -->
              <el-form-item prop="username" class="animated slideInLeft">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="账号"
                  size="medium"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="user"
                    class="el-input__icon input-icon"
                  />
                </el-input>
              </el-form-item>
              <el-form-item prop="password" class="animated slideInRight">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  size="medium"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="password"
                    class="el-input__icon input-icon"
                  />
                </el-input>
              </el-form-item>
              <!-- <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            size="medium"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
              style="color: #ff0"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="getCode">
          </div>
        </el-form-item> -->
              <el-checkbox
                v-model="loginForm.rememberMe"
                class="login-checkbox animated bounceInRight"
                label="记住密码"
              />
              <el-form-item style="width: 100%" class="animated bounceInLeft">
                <el-button
                  :loading="loading"
                  class="login-btn"
                  size="medium"
                  type="primary"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                  <div />
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bottom-box animated bounceInUp">
      <img src="@/assets/login/+++.png" class="jia-img" alt="">
    </div>
  </div>
</template>

<script>
// import { getCodeImg } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        // code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ]
        // code: [
        //   { required: true, trigger: 'change', message: '验证码不能为空' }
        // ]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    // getCode() {
    //   getCodeImg().then((res) => {
    //     this.codeUrl = 'data:image/gif;base64,' + res.img;
    //     this.loginForm.uuid = res.uuid;
    //   });
    // },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
              // this.getCode();
            });
        } else {
          this.isErrorScoll();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import './login.scss';
//
::v-deep .el-form-item__content{
  line-height: 36px;
  font-size: 14px;
}
::v-deep .el-input__inner{
  padding-left: 30px;
}
::v-deep .el-input--medium{
  font-size: 14px;
}
// ::v-deep .el-checkbox{
//   font-size: 14px;
//   .el-checkbox__label{
//     font-size: 14px;
//     line-height: 19px;
//     padding-left: 10px;
//   }
// }
::v-deep .el-checkbox__inner{
  // width: 14px;
  // min-width: 0.7rem;
  // min-height: 0.7rem;
  // height: 14px;
  &:after{
    // height:8px;
    // min-height: 0.35rem;
    // left: 4px;
    // top: 1px;
  }
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}
.login .title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #fff;
}
.login .el-input__icon {
  color: #000 !important;
}
.login .el-input__icon *{
  color: #000 !important;
}
.login .input-icon svg-icon {
color: #000 !important;
}
::v-deep.el-input--medium .el-input__icon{
  line-height: 36px;
}
.login .el-input__inner {
  color: #000 !important;
}
.login .el-input__icon {
  color: #000 !important;
}
::v-deep .el-input__prefix {
  color: #000 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 10px;
}
.login .login-form {
  border-radius: 6px;
  width: 380px;
  // padding: 25px 25px 5px 25px;
  position: absolute;
  z-index: 9;
  right: 15%;
  top: 60px;
}
.login .login-form .el-input {
  height: 40px;
  line-height: 40px;
}
.login-checkbox{
  color: #000;
  margin-bottom: 20px;
}
::v-deep.el-input--medium .el-input__inner{
  height: 40px;
  line-height: 40px;
}
.login .login-form .el-input input {
  height: 40px;
}
.el-form-item{
  margin-bottom: 30px;
}
// .login .login-form .input-icon {
//   height: 39px;
//   width: 14px;
//   margin-left: 2px;
// }
.login .login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color: #566dfc;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
  background: #566dfc;
  border-color: #566dfc;
}
.login-btn{
 background:  linear-gradient(270deg, #517DFF 0%, #8561FF 100%);
 box-shadow: 0px 9px 22px rgba(99, 116, 255, 0.47);
 width: 551px;
 height: 40px;
 line-height: 40px;
 font-size: 18px;
 padding: 0;
//  border: none;

}
::v-deep .el-button{
  border: none;
  &::before{
    bottom: 0px;
  }
}
</style>
