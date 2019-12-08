<template>
  <div>
    <template>
      <el-input v-model="namezh" placeholder="请输入角色名称" style="width:300px;"></el-input>
      <el-button icon="el-icon-search" @click="query" size="big" circle>查询</el-button>
      <el-button @click="dialogFormVisible = true" type="primary" size="big">添加角色</el-button>
      <el-table :data="roleList" style="width: 100%">
        <el-table-column fixed prop="id" label="序号"></el-table-column>
        <el-table-column prop="nameZh" label="角色名称"></el-table-column>
        <el-table-column prop="name" label="角色标识"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">+授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center">
        <el-pagination
          @current-change="list"
          :current-page="pagination.current"
          :page-count="pagination.pages"
        ></el-pagination>

        <el-dialog title="角色添加" :visible.sync="dialogFormVisible">
          <el-form :model="addrole">
            <el-form-item label="角色名称">
              <el-input v-model="addrole.nameZh" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-select v-model="addrole.name" placeholder="请选择角色标识">
                <el-option v-for="item in nameList" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="角色授权" :visible.sync="dialogFormVisible1">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-checked-keys="keyss"
            :props="defaultProps"
            ref="tree"
          ></el-tree>

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
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    return {
      roleList: [],
      pagination: [],
      namezh: "",
      dialogFormVisible: false,
      //添加对象
      addrole: {},
      //标识集合
      nameList: [],
      dialogFormVisible1: false,
      menuList: [],
      //回显对应角色的权限数组
      keyss: [],

      defaultProps: {
        children: "menuList",
        label: "name"
      },
      mid:"",
      parms:""
    };
  },
  mounted() {
    this.parms = {"access_token":localStorage.getItem("access_token")};
    this.list(1);
    //查询所有的角色标识
    this.getName();
  },
  methods: {
    list(page) {
      var self = this;
      axios
        .get("http://localhost:8080/api/role/page?pageNum=" + page+"&grant_type=password"+"&access_token="+this.parms.access_token)
        .then(function(res) {
          self.roleList = res.data.object.records;
          self.pagination = res.data.object;
        });
    },
    query() {
      var self = this;
      this.$ajax
        .get("http://localhost:8080/role/page?pageNum=1&nameZh=" + this.namezh)
        .then(function(res) {
          self.roleList = res.data.object.records;
          self.pagination = res.data.object;
        });
    },
    //查询所有的

    //准备授权
    handleClick(row) {
      var self = this;
      alert(row.id);
      self.mid=row.id;
      self.dialogFormVisible1 = true;
      axios.get("http://localhost:8080/role/selectMenuAll").then(function(res) {
        console.log(res.data.object);
        self.menuList = res.data.object;
      });
      axios
        .get("http://localhost:8080/role/selectMenuByRid?rid=" + row.id)
        .then(function(res) {
          self.keyss = res.data.object;
          console.log(self.keyss);
        });
    },
    giveRole() {
      var self = this;
      alert(this.$refs.tree.getCheckedKeys());
      
        self.$ajax({
          url:
            "http://localhost:8080/role/giveMenu",
          method: "post",
          data:{id:self.mid,mids:this.$refs.tree.getCheckedKeys()}
        })
        .then(function(res) {
          if (res) {
            self.$message("授权成功");
            self.dialogFormVisible1 = false;
            self.list(1);
          } else {
            self.$message("授权失败");
          }
        });
    },
    addRole() {
      var self = this;
      this.$ajax({
        url: "http://localhost:8080/role/addRole",
        method: "post",
        params: self.addrole
      }).then(function(res) {
        if (res.data.object) {
          alert("添加成功");
          self.dialogFormVisible = false;
          self.addrole = {};
          self.list(1);
        } else {
          alert("添加失败");
        }
      });
    },

    //获取所有的角色标识
    getName() {
      //getAllName
      var self = this;
      axios.get("http://localhost:8080/role/getAllName").then(function(res) {
        self.nameList = res.data.object;
      });
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
  