<template>
  <div>
    <template>
      
      <el-table :data="logList" style="width: 100%">
        <el-table-column fixed prop="_id" label="匿名编号"></el-table-column>
        <el-table-column fixed prop="user" label="操作用户"></el-table-column>
        <el-table-column prop="content" label="操作内容" width="280"></el-table-column>
        <el-table-column prop="opeartime" label="操作时间"></el-table-column>
       <el-table-column prop="way" label="方式"></el-table-column>
       <el-table-column prop="methods" label="方法名"></el-table-column>
       <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center">
        <el-pagination
          @current-change="list"
          :current-page="pagination.number+1"
          :page-count="pagination.totalPages"
        ></el-pagination>
       
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
export default {
    data (){
     return {
         logList:[],
         pagination:[]
     }   
    },
    mounted(){
       this.list(1);
    },
    methods:{
        list (page){
             var self = this;
         axios
        .get("http://localhost:8080/log/selectAlllog?pageNum=" + (page-1))
        .then(function(res) {
            console.log("日志"+res.data.object.content);
          self.logList = res.data.object.content;
          self.pagination = res.data.object;
        });
        },
       delClick (row){
         
           var self = this;
           
           axios.delete("http://localhost:8080/log/delById?id="+row._id).then(function(res){
             console.log("-----------------------"+res);
              if(res.data.object){
                self.$message("删除成功");
                self.list(1);
              }else{
                 self.$message("删除失败");
                 self.list(1);
              }
           })
       }
    }

}
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