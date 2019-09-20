<template>
  <div>
    <template>
      <el-input v-model="username" placeholder="请输入用户名" style="width:300px;"></el-input>

      <el-button icon="el-icon-search" @click="query" size="big" circle>查询</el-button>
      <el-button @click="dialogFormVisible = true" type="primary" size="big">添加用户</el-button>
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="telephone" label="联系地址"></el-table-column>
        <el-table-column prop="enabled" label="是否有效">
          <template slot-scope="scope">{{scope.row.enabled==1?'是':'否' }}</template>
        </el-table-column>
        <el-table-column prop="userface" label="用户图片">
          <template slot-scope="scope">
            <img :src="scope.row.userface" width="100px" alt="没有图片" />
          </template>
        </el-table-column>
        <el-table-column prop="namezh" label="在线职位"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center">
        <el-pagination
          @current-change="list"
          :current-page="pagination.current"
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

        <el-dialog title="授权" :visible.sync="dialogFormVisible1" >
          <el-checkbox-group v-model="rids" >
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
      addBean: {
        userface: ""
      },
      checkname: "",
      roles: [],
      rids: [],
      //授权的对象
      changeRole:{
        id:"",
        rids:[]
      }
      
    };
  },
  mounted() {
    this.list(1);
    
  },
  methods: {
    list(page) {
      var self = this;
      this.$ajax
        .get("http://localhost:8080/user/selectUserByUsername?pageNum=" + page)
        .then(function(res) {
          console.log("============={}", res.data.object);
          self.userList = res.data.object.records;
          self.pagination = res.data.object;
        });
    },
    query() {
      var self = this;
      this.$ajax
        .get(
          "http://localhost:8080/user/selectUserByUsername?pageNum=1&username=" +
            this.username
        )
        .then(function(res) {
          self.userList = res.data.object.records;
          self.pagination = res.data.object;
        });
    },

    //开始授权
    handleClick(row) {
      
      var self = this;
      self.changeRole.id = row.id;
      this.showAllRoles();
      this.dialogFormVisible1 = true;
       axios.get("http://localhost:8080/user/selectRoleByUid?uid="+row.id).then(function(res) {
         console.log("000000000000000000000"+res.data.object);
        self.rids = res.data.object;
        console.log(self.rids);
      });
    },
    //授权
    giveRole (){//giveRole
      
       var self = this;
       self.changeRole.rids = this.rids;
       console.log(this.changeRole);
       let config = { headers: { "Content-Type": "multipart/form-data" } };
       self.$ajax({
                url: 'http://localhost:8080/user/giveRole?id='+self.changeRole.id+"&rids="+self.changeRole.rids,
                method: 'post', 
            }).then(function(res){

         if(res){
           self.$message("授权成功");
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
      console.log("穿进去的对象是：{}", this.addBean);
      var bean = this.addBean;
      this.$ajax({
        url: "http://localhost:8080/user/addUser",
        method: "post",
        params: bean
      }).then(function(res) {
        if (res.data.object) {
          alert("添加成功");
          self.dialogFormVisible = false;
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

    handleAvatarSuccess: function(res, file) {
      this.addBean.userface = file.response.url;
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