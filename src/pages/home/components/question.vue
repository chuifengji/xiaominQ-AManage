<template>
  <div>
    <div class="function_zone">
      <div class="search_box">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </div>
      <el-button
        :icon="[
          !Table_Add_Visible && !Table_Edit_Visible
            ? 'el-icon-plus'
            : 'el-icon-close',
        ]"
        class="button_icon_self"
        @click="handleAdd()"
        circle
      ></el-button>
    </div>
    <!-- 点击添加后展示内容 -->
    <div v-if="Table_Add_Visible" class="add_form_contanier">
      <el-form :model="form_add" label-position="left" label-width="100px">
        <el-form-item label="所属板块">
          <el-select v-model="form_add.forum_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题标题">
          <el-input
            v-model="form_add.question_title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属答案">
          <el-input
            :autosize="{ minRows: 10 }"
            v-model="form_add.question_content"
            type="textarea"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Table_Add_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            Table_Add_Visible = false;
            addQuestion();
          "
          >确 定</el-button
        >
      </div>
    </div>

    <div v-if="Table_Edit_Visible" class="add_form_contanier">
      <el-form :model="form_edit" label-position="left" label-width="100px">
        <el-form-item label="问题序号">
          <el-input
            v-model="form_edit.question_id"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属板块">
          <el-select v-model="form_edit.forum_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题标题">
          <el-input
            v-model="form_edit.question_title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属答案">
          <el-input
            :autosize="{ minRows: 10 }"
            v-model="form_edit.question_content"
            type="textarea"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Table_Edit_Visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            Table_Edit_Visible = false;
            editQuestion();
          "
          >确 定</el-button
        >
      </div>
    </div>
    <!-- 表格主体内容 -->
    <el-table
      ref="multipleTable"
      v-if="!Table_Add_Visible && !Table_Edit_Visible"
      :data="
        tableData
          .filter(
            (data) =>
              !search ||
              data.forum_title.toLowerCase().includes(search.toLowerCase()) ||
              data.question_title.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      tooltip-effect="dark"
      :height="tableHeight"
      style="width: 100%;font-size:12px;white-space:pre-wrap;position:relative;"
    >
      <el-table-column type="selection" min-width="5%"> </el-table-column>
      <el-table-column prop="question_id" label="问题序号" min-width="6%">
      </el-table-column>
      <el-table-column prop="forum_title" label="所属板块" min-width="6%">
      </el-table-column>
      <el-table-column prop="question_title" label="问题标题" min-width="7%">
      </el-table-column>
      <el-table-column prop="question_content" label="问题答案" min-width="54%">
        <template slot-scope="scope">
          <div v-html="scope.row.question_content"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="12%" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="
              Table_Edit_Visible = true;
              handleEdit(scope.$index, scope.row);
            "
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="text-align: center;position:fixed;width:100%;bottom:8px;"
      v-if="!Table_Add_Visible && !Table_Edit_Visible"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      options: [],
      tableHeight: 0,
      Table_Add_Visible: false,
      Table_Edit_Visible: false,
      question_id_visible: true,
      currentQuestionContent: "",
      currentQuestion_id: 0,
      form_edit: {
        question_id: "",
        forum_id: "",
        question_title: "",
        question_content: "",
      },
      form_add: {
        forum_id: "",
        question_title: "",
        question_content: "",
      },
      search: "",
      tableData: [],
      multipleSelection: [],
      total: 100,
      pagesize: 10,
      currentPage: 1,
    };
  },
  created() {
    this.tableHeight =
      window.innerHeight - (window.innerWidth / (100 / 4.2) + 86); //4.2是header高度
    this.getData();
    this.options = JSON.parse(localStorage.getItem("plateList"));
  },
  methods: {
    addQuestion: function() {
      let { question_title, question_content, forum_id } = this.form_add;
      question_content = question_content.replace(/\n/g, "<br>");
      question_content = question_content.replace(/ /g, "&nbsp");
      this.axios
        .post("question/", {
          question_title,
          question_content,
          forum_id,
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
    editQuestion: function() {
      let { question_title, question_content, forum_id } = this.form_edit;
      question_content = question_content.replace(/\n/g, "<br>");
      question_content = question_content.replace(/ /g, "&nbsp;");
      this.axios({
        method: "put",
        url: "question/" + this.currentQuestion_id,
        data: {
          question_title,
          question_content,
          forum_id,
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
          this.$message({
            type: "info",
            message: "修改失败!",
            showClose: true,
          });
        }
      });
    },
    getData: function() {
      let questionData = JSON.parse(localStorage.getItem("questionData"));
      if (questionData) {
        this.tableData = questionData;
        this.total = questionData.length;
      } else {
        this.getNewData();
      }
    },
    getNewData: function() {
      this.axios({
        method: "get",
        url: "question/",
      }).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.data.length;
        this.$store.dispatch("setquestionData", res.data.data);
      });
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    handleAdd: function() {
      let A = this.Table_Add_Visible;
      let E = this.Table_Edit_Visible;
      if (A === false && E == false) {
        this.Table_Add_Visible = true;
      } else if (A === true && E == false) {
        this.Table_Add_Visible = false;
      } else if (A === true && E == true) {
        this.Table_Edit_Visible = false;
        this.Table_Add_Visible = false;
      } else {
        this.Table_Edit_Visible = false;
      }
    },
    handleEdit(scope_$index, scope_row) {
      this.form_edit = scope_row;
      this.currentQuestion_id = scope_row.question_id;
      this.form_edit.question_content = scope_row.question_content.replace(
        /<br>/g,
        "\n"
      );
      this.form_edit.question_content = scope_row.question_content.replace(
        /&nbsp;/g,
        " "
      );
    },
    handleDelete: function(scope_$index, scope_row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("question/" + scope_row.question_id).then((res) => {
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
    mounted: function() {
      this.addUser();
    },
  },
};
</script>

<style>
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
.add_form_contanier /deep/.dialog-footer {
  text-align: center;
}
.add_form_contanier {
  position: relative;
  width: 80%;
  left: 10%;
  top: 30px;
  text-align: left;
}
</style>
