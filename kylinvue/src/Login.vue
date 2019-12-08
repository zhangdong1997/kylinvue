<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    class="login-container"
    label-position="left"
    label-width="0px"
    v-loading="loading"
  >
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" auto-complete="off" placeholder="账号" v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" auto-complete="off" placeholder="密码" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item prop="code"> 
      <div class="el-form-item__content" style="margin-left: 0px;">
        <div class="el-row" span="24">
          <div class="el-col el-col-16">
            <div class="el-input el-input--prefix">
              <!---->
              <input
                type="text"
                autocomplete="off"
                maxlength="4"
                placeholder="请输入验证码"
                class="el-input__inner"
                v-model="ruleForm.code"
              />
            </div>
          </div>
          <div class="el-col el-col-8">
            <div class="login-code">
              <img :src="codeUrl" class="login-code-img" @click="codeOnclick()" />
            </div>
          </div>
        </div>
      </div>
    </el-form-item>

    <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
    
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%" @click="submitClick()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
export default {
  name: "login",
  props: {
    msg: String
  },
  
    
   data() {
    return {
      loading: false,
      checked: false,
      codeUrl: "http://localhost:9999/code?randomStr=128989898",
      ruleForm: {
        username: "lisi",
        password: "123456",
        randomStr: "",
        grant_type:'password',
        code: ""
        
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "长度不能少于4个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.codeOnclick();
   },

    
  methods: {
     codeOnclick() {
      var randomStr = new Date().getTime();
      console.log("======{}", randomStr);
      this.codeUrl = "http://localhost:9999/code?randomStr=" + randomStr;
      this.ruleForm.randomStr = randomStr;
    },

    getUserInfo(){
      var $this = this;
      var parms = {"access_token":localStorage.getItem("access_token")};
      console.log(parms);
      this.$ajax({
          url: "http://localhost:8080/api/user/info",
          method: "get", // default
          params: parms
        }).then(function(res) {
          console.log('oauth2.0請求成功{}',res);
          $this.$message(res.data.msg);
          if (res.data.code == 200) {
            $this.$message(res.data.msg);
            //并且使用vuex 保存状态信息
            $this.$store.commit("login", res.data.object);
            //通过路由跳转页面
            $this.$router.replace({ path: "/home" });
          }
        })
    },

   


    submitClick() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return ;
        }
        var $this = this;
        this.$ajax({
          url: "http://localhost:9999/auth/oauth/token",
          method: "post", // default
          params: this.ruleForm,
          auth: {
            username: 'android',
            password: 'android'
          }
        }).then(function(res) {
          console.log("认证请求返回结果为:{}", res);
          
           if(res.data.access_token){
            localStorage.setItem("access_token",res.data.access_token);
            alert(res.data.access_token);
            $this.getUserInfo();
            console.log({"access_token":localStorage.getItem("access_token")}.access_token);
          }
        });
      });
    

    },
    

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  
};
</script>
<style>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #e72a2a;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #234568;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>


