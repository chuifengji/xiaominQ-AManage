<template>
  <div>
    <div class="function_zone">
      <div class="search_box">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </div>
      <el-button
        icon="el-icon-plus"
        class="button_icon_self"
        circle
        @click="handleAdd()"
      ></el-button>
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
      <el-table-column type="selection" min-width="12%"></el-table-column>
      <el-table-column
        prop="navbar_id"
        label="导航栏序号"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="navbar_title"
        label="导航栏标题"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="navbar_color_text"
        label="文字颜色（选中后）"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="navbar_color_bg"
        label="背景颜色（选中后）"
        min-width="12%"
      ></el-table-column>
      <el-table-column label="操作" min-width="18%" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div
      style="text-align: center;position:fixed;width:100%;bottom:8px;margin-top:8px;"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>

    <el-dialog title="修改/编辑导航栏" :visible.sync="dialogForm_Edit_Visible">
      <el-form :model="form_edit">
        <el-form-item label="导航栏序号" :label-width="formLabelWidth">
          <el-input v-model="form_edit.navbar_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="导航栏标题" :label-width="formLabelWidth">
          <el-input
            v-model="form_edit.navbar_title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="文字颜色" :label-width="formLabelWidth">
          <el-input
            v-model="form_edit.navbar_color_text"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="背景颜色" :label-width="formLabelWidth">
          <el-input
            v-model="form_edit.navbar_color_bg"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm_Edit_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogForm_Edit_Visible = false;
            editNavbar();
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="增加导航栏" :visible.sync="dialogForm_Add_Visible">
      <el-form :model="form_add" label-position="left">
        <el-form-item label="导航栏标题" :label-width="formLabelWidth">
          <el-input
            v-model="form_add.navbar_title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="文字颜色" :label-width="formLabelWidth">
          <el-input
            v-model="form_add.navbar_color_text"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="背景颜色" :label-width="formLabelWidth">
          <el-input
            v-model="form_add.navbar_color_bg"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm_Add_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogForm_Add_Visible = false;
            addNavbar();
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      search: "",
      currentNavbar_id: 0,
      tableHeight: 0,
      dialogForm_Edit_Visible: false,
      dialogForm_Add_Visible: false,
      form: {
        navbar_id: "",
        navbar_title: "",
        navbar_color_text: "",
        navbar_color_bg: "",
      },
      form_edit: {
        navbar_id: "",
        navbar_title: "",
        navbar_color_text: "",
        navbar_color_bg: "",
      },
      form_add: {
        navbar_title: "",
        navbar_color_text: "",
        navbar_color_bg: "",
      },
      formLabelWidth: "120px",
      tableData: [],
      multipleSelection: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
    };
  },
  created() {
    this.tableHeight =
      window.innerHeight - (window.innerWidth / (100 / 4.2) + 86); //4.2是header高度
    this.getData();
  },
  methods: {
    addNavbar: function() {
      let { navbar_title, navbar_color_text, navbar_color_bg } = this.form_add;
      this.axios
        .post("navbar/", {
          navbar_title,
          navbar_color_bg,
          navbar_color_text,
        })
        .then((res) => {
          if (res.data["status_code"] == 200) {
            this.getNewData();
            this.$message({
              type: "success",
              message: "增加成功!",
              showClose: true,
            });
          } else {
            this.$message({
              type: "info",
              message: "增加失败!",
              showClose: true,
            });
          }
        });
    },
    editNavbar: function() {
      let {
        navbar_id,
        navbar_title,
        navbar_color_text,
        navbar_color_bg,
      } = this.form_edit;
      axios({
        method: "put",
        url: "navbar/" + this.currentNavbar_id,
        data: {
          navbar_id,
          navbar_title,
          navbar_color_text,
          navbar_color_bg,
        },
      }).then((res) => {
        if (res.data["status_code"] == 200) {
          this.getNewData();
          this.$message({
            type: "success",
            message: "修改成功!",
            showClose: true,
          });
        } else {
          this.getNewData();
          this.$message({
            type: "info",
            message: "修改失败!",
            showClose: true,
          });
        }
      });
    },
    getData: function() {
      let navBarData = JSON.parse(localStorage.getItem("navBarData"));
      if (navBarData) {
        this.tableData = navBarData;
      } else {
        this.getNewData();
      }
    },
    getNewData: function() {
      this.axios({
        method: "get",
        url: "navbar/",
      }).then((res) => {
        this.tableData = res.data.data;
        this.$store.dispatch("setNavBarData", res.data.data);
        this.$store.dispatch(
          "setnavList",
          res.data.data.map((item) => {
            return {
              value: item.navbar_id,
              label: item.navbar_title,
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
      this.currentNavbar_id = scope_row.navbar_id;
      this.dialogForm_Edit_Visible = true;
    },
    handleAdd: function(scope_$index, scope_row) {
      this.dialogForm_Add_Visible = true;
    },
    handleDelete: function(scope_$index, scope_row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("navbar/" + scope_row.navbar_id).then((res) => {
            if (res.data["code"] == 200) {
              this.getNewData();
              this.$message({
                type: "success",
                message: "删除成功!",
                showClose: true,
              });
            } else {
              this.$message({
                type: "info",
                message: "删除失败!",
                showClose: true,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            showClose: true,
          });
        });
    },
    handleSelectionChange: function() {},
    mounted: function() {
      this.addUser();
    },
  },
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
