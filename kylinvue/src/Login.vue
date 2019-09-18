<template>
  
  <div class="hello" >
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-container" style="width: 500px;" >
     <img src="./assets/哪吒.jpg" style="width:300px;height:300px;margin-left:100px;">
   
    <h3 class="login_title">系统登录</h3>
    <el-form-item label="用户名" prop="username">
    <el-input type="text" v-model="ruleForm.username" autocomplete="off" ></el-input>
  </el-form-item>
   
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
  </el-form-item>
  

  
    
  
  <el-form-item>
      <el-checkbox class="login_remember" v-model="checked"
                 label-position="left">记住密码</el-checkbox>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="primary" >注册</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
    
  </el-form-item>
</el-form>
    
    
  </div>
</template>

<script>
	import axios from 'axios'
export default {
  name: 'login',
  props: {
    msg: String
  },
   data() {
      
      
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      
      
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      
      return {
      	checked:false,
        ruleForm: {
        	username:'',
          password: ''
          
        },
        rules: {
        	username: [
            { validator: validatePass1, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass2, trigger: 'blur' }
          ]
         
         
        }
      };
    },
    methods: {
      login (){
      	var $this = this;
      this.$ajax({
                url: 'http://localhost:8080/login',
                method: 'post', 
                params: this.ruleForm,
            }).then(function(res){
                console.log("认证请求返回结果为:{}",res);
                $this.$message(res.data.msg);
                if(res.data.code==200){
                    //通过路由跳转页面
                    $this.$router.replace({path:"/home"});
                    //并且使用vuex 保存状态信息
                    
                }
            })
        
      		 
      		 
      	
      	
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
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


