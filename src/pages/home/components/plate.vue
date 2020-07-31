<template>
  <div>
    <div class="function_zone">
      <div class="search_box">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </div>
      <el-button icon="el-icon-plus" class="button_icon_self" circle @click="handleAdd()"></el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      tooltip-effect="dark"
      :height="tableHeight"
      style="width: 100%;font-size:12px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" min-width="5%"></el-table-column>
      <el-table-column prop="forum_id" label="板块序号" min-width="12%"></el-table-column>
      <el-table-column prop="forum_title" label="板块标题" min-width="14%"></el-table-column>
      <el-table-column prop="navbar_title" label="所属导航栏" min-width="14%"></el-table-column>
      <el-table-column prop="forum_visited" label="热度" min-width="14%"></el-table-column>
      <el-table-column prop="forum_icon" label="图标" width="120" min-width="14%">
        <template slot-scope="scope">
          <img
            style="width:40px;height:40px;filter: drop-shadow(#909399 80px 0);
transform: translateX(-80px);"
            :src="scope.row.forum_icon"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="18%" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;position:fixed;width:100%;bottom:8px;margin-top:8px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <el-dialog style="text-align: left;" title="修改/编辑板块" :visible.sync="dialogForm_Edit_Visible">
      <el-form :model="form_edit" label-position="left">
        <el-form-item label="板块序号" :label-width="formLabelWidth">
          <el-input v-model="form_edit.forum_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="板块标题" :label-width="formLabelWidth">
          <el-input v-model="form_edit.forum_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属导航栏" :label-width="formLabelWidth">
          <el-select v-model="form_edit.navbar_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标base64编码" :label-width="formLabelWidth">
          <el-input v-model="form_edit.forum_icon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm_Edit_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogForm_Edit_Visible = false;
            editForum();
          "
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="增加板块" :visible.sync="dialogForm_Add_Visible">
      <el-form :model="form_add" label-position="left">
        <el-form-item label="板块标题" :label-width="formLabelWidth">
          <el-input v-model="form_add.forum_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属导航栏" :label-width="formLabelWidth">
          <el-select v-model="form_add.navbar_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标base64编码" :label-width="formLabelWidth">
          <el-input v-model="form_add.forum_icon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm_Add_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogForm_Add_Visible = false;
            addForum();
          "
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Plate",
  data() {
    return {
      options: [],
      tableHeight: 0,
      currentForum_id: 0,
      dialogForm_Edit_Visible: false,
      dialogForm_Add_Visible: false,
      formLabelWidth: "120px",
      form_add: {
        forum_icon: "",
        forum_title: "",
        navbar_id: 0
      },
      form_edit: {
        forum_icon: "",
        forum_id: 0,
        forum_title: "",
        navbar_id: 0
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      pagesize: 10,
      currentPage: 1
    };
  },
  created() {
    this.tableHeight =
      window.innerHeight - (window.innerWidth / (100 / 4.2) + 86); //4.2是header高度
    this.getData();
    this.options = JSON.parse(localStorage.getItem("navList"));
  },
  methods: {
    addForum: function() {
      let { navbar_id, forum_title, forum_icon } = this.form_add;
      this.axios
        .post("forum/", {
          navbar_id,
          forum_title,
          forum_icon
        })
        .then(res => {
          if (res.data["status_code"] == 200) {
            this.getNewData();
            axios({
              method: "get",
              url: "http://129.28.35.195:3000/"
            }).then(res => {});
            this.$message({
              type: "success",
              message: "修改成功!",
              showClose: true
            });
          } else {
            this.getNewData();
            this.$message({
              type: "info",
              message: "修改失败!",
              showClose: true
            });
          }
        });
    },
    editForum: function() {
      let { navbar_id, forum_title, forum_icon } = this.form_edit;
      axios({
        method: "put",
        url: "forum/" + this.currentForum_id,
        data: {
          navbar_id,
          forum_title,
          forum_icon
        }
      }).then(res => {
        if (res.data["status_code"] == 200) {
          this.getNewData();
          axios({
            method: "get",
            url: "http://129.28.35.195:3000/"
          }).then(res => {});
          this.$message({
            type: "success",
            message: "修改成功!",
            showClose: true
          });
        } else {
          this.getNewData();
          this.$message({
            type: "info",
            message: "修改失败!",
            showClose: true
          });
        }
      });
    },
    getData: function() {
      let plateData = JSON.parse(localStorage.getItem("plateData"));
      if (plateData) {
        this.tableData = plateData;
        this.total = plateData.length;
      } else {
        this.getNewData();
      }
    },
    getNewData: function() {
      this.axios({
        method: "get",
        url: "forum/"
      }).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.data.length;
        this.$store.dispatch("setplateData", res.data.data);
        this.$store.dispatch(
          "setplateList",
          res.data.data.map(item => {
            return {
              value: item.forum_id,
              label: item.forum_title
            };
          })
        );
      });
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    handleEdit: function(scope_$index, scope_row) {
      this.form_edit = scope_row;
      this.currentForum_id = scope_row.forum_id;
      this.dialogForm_Edit_Visible = true;
    },
    handleAdd: function(scope_$index, scope_row) {
      this.dialogForm_Add_Visible = true;
    },
    handleDelete: function(scope_$index, scope_row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.delete("forum/" + scope_row.forum_id).then(res => {
            if (res.data["code"] == 200) {
              this.getNewData();
              axios({
                method: "get",
                url: "http://129.28.35.195:3000/"
              }).then(res => {});
              this.$message({
                type: "success",
                message: "删除成功!",
                showClose: true
              });
            } else {
              this.$message({
                type: "info",
                message: "删除失败!",
                showClose: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            showClose: true
          });
        });
    },
    mounted: function() {
      this.addUser();
    }
  }
};
</script>
<style scoped>
.function_zone {
  position: relative;
  width: 100%;
  margin-top: 10px;
  height: 28px;
}
.search_box {
  position: absolute;
  width: 20%;
  left: 1%;
}
.button_icon_self {
  position: absolute;
  right: 6.2%;
}
.function_zone /deep/ .el-button.is-circle {
  padding: 6px;
}
</style>
