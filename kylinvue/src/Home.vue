<template>
  <div>
    <el-container class="home-container" style="height: 500px; border: 1px solid #eee">
      <el-header class="home-header">
        <span class="home_title">快速开发平台</span>
        <el-dropdown>
          <span>王小虎</span>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router>
            <el-submenu index="1" v-for="item in this.$router.options.routes[1].children" >
              <template slot="title">
                <i class="el-icon-message"></i>
                {{item.name}}
              </template>
              <el-menu-item-group>
                <el-menu-item :index="sub.path" v-for="sub in item.children" >{{sub.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  mounted() {
    let routequery = this.$route.query;
    this.$message(routequery.obj);
    console.log(routequery.obj);
  }
};
</script>

<style>
.el-header {
  background-color: rgb(9, 210, 245);
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.home-container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.home-header {
  background-color: #4920ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 15px;
}
.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
  margin-left: 8px;
}
.home-aside {
  background-color: #ececec;
}
</style>
