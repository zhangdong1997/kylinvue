<template>
  <div>
    <template>
      <el-input v-model="username" placeholder="请输入用户名" style="width:300px;"></el-input>

      <el-button icon="el-icon-search" @click="query" size="big" circle>查询</el-button>
      <el-button @click="dialogFormVisible = true" type="primary" size="big">添加用户</el-button>
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100px">
          <template slot-scope="scope">
            <div v-html="scope.row.name">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="100px">
           <template slot-scope="scope">
            <div v-html="scope.row.username">{{scope.row.username}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" >
           <template slot-scope="scope">
            <div v-html="scope.row.phone">{{scope.row.phone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="联系地址">
           <template slot-scope="scope">
            <div v-html="scope.row.telephone">{{scope.row.telephone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="是否有效">
          <template slot-scope="scope">
            <div v-html="scope.row.telephone">
            {{scope.row.enabled==1?'是':'否' }}
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="userface" label="用户图片">
          <template slot-scope="scope">
            <img :src="scope.row.userface" width="100px" alt="没有图片" />
          </template>
        </el-table-column>
        <el-table-column prop="namezh" label="在线职位">
          <template slot-scope="scope">
            <div v-html="scope.row.namezh">{{scope.row.namezh}}</div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            
            <el-button @click="handleClick(scope.row)" type="text" size="small">授权</el-button>
            <el-button @click="updateClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="resetPwdClick(scope.row)" type="text" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center">
        <el-pagination
          @current-change="list"
          :current-page="pagination.current+1"
          :page-count="pagination.pages"
        ></el-pagination>

        <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
          <el-form :model="addBean">
            <el-form-item label="姓名">
              <el-input v-model="addBean.name" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="addBean.username" style="width:300px;"></el-input>
              <span style="color:red;">{{checkname}}</span>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="addBean.password" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="addBean.phone" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="住宅电话">
              <el-input v-model="addBean.telephone" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="联系地址">
              <el-input v-model="addBean.address" style="width: 300px;"></el-input>
            </el-form-item>

            <el-form-item label="景点图片">
              <el-upload
                :http-request="uploadUserFace"
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <img v-if="addBean.userface" :src="addBean.userface" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </div>
        </el-dialog>



        <el-dialog title="修改用户" :visible.sync="dialogFormVisible2">
          <el-form :model="updateBean">
            <el-form-item label="姓名">
              <el-input v-model="updateBean.name" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="updateBean.username" style="width:300px;"></el-input>
              <span style="color:red;">{{checkname}}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="updateBean.phone" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="住宅电话">
              <el-input v-model="updateBean.telephone" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="联系地址">
              <el-input v-model="updateBean.address" style="width: 300px;"></el-input>
            </el-form-item>

            <el-form-item label="景点图片">
              <el-upload
                :http-request="uploadUserFace1"
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <img v-if="updateBean.userface" :src="updateBean.userface" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="updateUser">确 定</el-button>
          </div>
        </el-dialog>


        
       



        <el-dialog title="授权" :visible.sync="dialogFormVisible1" >
          <el-checkbox-group v-model="changeRole.rids" >
            <el-checkbox   v-for="item in roles" :label="item.id" >{{item.nameZh}}</el-checkbox>
          </el-checkbox-group>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取消授权</el-button>
            <el-button type="primary" @click="giveRole">确定授权</el-button>
          </div>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      username: "",
      pagination: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2:false,
      addBean: {
        userface: "",
        
      },
      updateBean: {
        userface: "",
        
      },
       
      checkname: "",
      roles: [],
      
      //授权的对象
      changeRole:{
        id:"",
        rids:[]
      }
      
    };
  },
  mounted() {
    this.list(1);
    this.showAllRoles();
  },
  methods: {
    resetPwdClick (row){
        var self  =this;
        var ret = confirm("确定重置密码吗？");
        if(ret){
             axios.get("http://localhost:8080/user/resetPwd?id="+row.id).then(function(res){
                if(res.data.object){
                  self.$message("发送成功");
                }else{
                  self.$message("发送失败");
                }
             })
        }
     
    },

    list(page) {
      var self = this;
      this.$ajax
        .get("http://localhost:8080/user/esUse?pageNum=" + (page-1)+"&name="+ this.username)
        .then(function(res) {
          console.log("============={}", res.data.object);
          //self.userList = res.data.object.records;
          //self.pagination = res.data.object;
           self.userList = res.data.object.content;
           self.pagination.current = res.data.object.number;
           self.pagination.pages = res.data.object.totalPages;
        });
    },
    query() {
      var self = this;
      this.$ajax
        .get(
          "http://localhost:8080/user/esUse?pageNum=0&name=" +
            this.username
        )
        .then(function(res) {
          console.log(res.data.object.content);
          self.userList = res.data.object.content;
          //self.pagination = res.data.object.pageable;
          self.pagination.current = res.data.object.number;
          self.pagination.pages = res.data.object.totalPages;
        });
    },
    updateClick (row){
      var self = this;
      self.dialogFormVisible2 = true;

      axios
        .get(
          "http://localhost:8080/user/getByid?id=" +
            row.id
        )
        .then(function(res) {
          console.log(res);
           self.updateBean = res.data.object;
        })
    },

    
    updateUser (){
      var self = this;//updateUser

       this.$ajax({
        url: "http://localhost:8080/user/updateUser",
        method: "put",
        params: self.updateBean,
      }).then(function(res) {
        if (res.data.code) {
          alert("修改成功");
          self.dialogFormVisible2 = false;
          self.updateBean = {};
          self.list(1);
        } else {
          alert("修改失败");
          self.dialogFormVisible2 = false;
        }
      });
     

    },

    //开始授权
    handleClick(row) {
      
      var self = this;
      self.changeRole.id = row.id;
      
      this.dialogFormVisible1 = true;
       axios.get("http://localhost:8080/user/Role/selectRoleByUid?uid="+row.id).then(function(res) {
         console.log("000000000000000000000"+res.data.object);
        self.changeRole.rids = res.data.object;
        console.log(self.rids);
      });
    },
    //授权
    giveRole (){//giveRole
      
       var self = this;
       
       console.log(this.changeRole);
       
       self.$ajax({
                url: 'http://localhost:8080/user/Role/giveRole?id='+self.changeRole.id+"&rids="+self.changeRole.rids,
                method: 'post', 
            }).then(function(res){

         if(res){
           self.$message("添加成功");
           self.dialogFormVisible1 = false;
           self.list(1);
          }else{
            self.$message("授权失败");
          }
        })
       
    },

    //显示说有的角色
    showAllRoles() {
      var self = this;
      axios.get("http://localhost:8080/role/getAllRoles").then(function(res) {
        self.roles = res.data.object;
      });
    },

    addUser() {
      var self = this;
      axios
        .get(
          "http://localhost:8080/user/checkName?username=" +
            this.addBean.username
        )
        .then(function(res) {
          if (res.data.object == 1) {
            self.checkname = "用户名已经存在";

            return;
          }
          self.checkname = "";
        });
         
      console.log("穿进去的对象是：{}", self.addBean);
       
      this.$ajax({
        url: "http://localhost:8080/user/addUser",
        method: "post",
        params: self.addBean,
      }).then(function(res) {
        if (res.data.code) {
          alert("添加成功");
          self.dialogFormVisible = false;
          self.checkname="";
          self.addBean = {};
          self.list(1);
        } else {
          alert("添加失败");
          self.dialogFormVisible = false;
        }
      });
    },
    //图片上产
    uploadUserFace(file) {
      var self = this;
      let formData = new FormData();
      formData.append("file", file.file);

      let config = { headers: { "Content-Type": "multipart/form-data" } };
      self.$ajax
        .post("http://localhost:8080/user/upload", formData, config)
        .then(function(res) {
          self.addBean.userface = res.data.url;
        });
    },
    uploadUserFace1(file) {
      var self = this;
      let formData = new FormData();
      formData.append("file", file.file);

      let config = { headers: { "Content-Type": "multipart/form-data" } };
      self.$ajax
        .post("http://localhost:8080/user/upload", formData, config)
        .then(function(res) {
          self.updateBean.userface = res.data.url;
        });
    },

    handleAvatarSuccess: function(res, file) {
      this.addBean.userface = file.response.url;
      console.log(file.response.url);
    },
    handleAvatarSuccess1: function(res, file) {
      this.updateBean.userface = file.response.url;
      console.log(file.response.url);
    },
    beforeAvatarUpload: function(file) {
      return file;
    }
    
  }
};
</script>



<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>