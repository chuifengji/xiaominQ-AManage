<template>
  <div>
    <div class="function_zone">
      <div class="search_box">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </div>
      <el-button
        :icon="[
          !Table_Model_Visible
            ? 'el-icon-plus'
            : 'el-icon-close',
        ]"
        class="button_icon_self"
        @click="handleAdd()"
        circle
      ></el-button>
    </div>

    <div v-if="Table_Model_Visible" class="add_form_contanier">
      <el-form :model="form_model" label-position="left" label-width="100px">
        <el-form-item v-if="Table_Add_Visible" label="问题序号">
          <el-input v-model="form_model.question_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属板块">
          <el-select v-model="form_model.forum_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题标题">
          <el-input v-model="form_model.question_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属答案">
          <editor ref="editorObject" :originalData="form_model.question_content"></editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="Table_Model_Visible = false;clearModel()">取 消</el-button>
        <el-button
          type="primary"
          @click="
            Table_Model_Visible = false;
            postQuestion();
          "
        >确 定</el-button>
      </div>
    </div>
    <!-- 表格主体内容 -->
    <el-table
      ref="multipleTable"
      v-if="!Table_Model_Visible"
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
      <el-table-column type="selection" min-width="5%"></el-table-column>
      <el-table-column prop="question_id" label="问题序号" min-width="6%"></el-table-column>
      <el-table-column prop="forum_title" label="所属板块" min-width="6%"></el-table-column>
      <el-table-column prop="question_title" label="问题标题" min-width="7%"></el-table-column>
      <el-table-column prop="question_content" label="问题答案" min-width="25%">
        <template slot-scope="scope">
          <div v-html="scope.row.question_content"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="12%" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row);
            "
          >编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="text-align: center;position:fixed;width:100%;bottom:8px;"
      v-if="!Table_Model_Visible"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { uploadInit } from "../../../assets/js/qiniu";
import Editor from "../../../components/Editor";
export default {
  name: "Question",
  components: {
    Editor,
  },
  data() {
    return {
      editorContent: "",
      options: [],
      tableHeight: 0,
      Table_Model_Visible: false,
      Table_Add_Visible: false,
      currentQuestionContent: "",
      currentQuestion_id: 0,
      form_model: {
        question_id: "",
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
  mounted: function () {
    this.addUser();
  },
  methods: {
    postQuestion: function () {
      this.Table_Add_Visible ? this.addQuestion() : this.editQuestion();
    },
    addQuestion: function () {
      console.log(this.$refs.editorObject.editorContent);
      let { question_title, forum_id } = this.form_model,
        question_content = this.$refs.editorObject.editorContent;
      this.axios
        .post("question/", {
          question_title,
          question_content,
          forum_id,
        })
        .then((res) => {
          if (res.data["status_code"] == 200) {
            this.getNewData();
            axios({
              method: "get",
              url: "http://129.28.35.195:3000/",
            }).then((res) => {});
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
    editQuestion: function () {
      console.log(this.$refs.editorObject.editorContent);
      let { question_title, forum_id } = this.form_model,
        question_content = this.$refs.editorObject.editorContent;
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
          axios({
            method: "get",
            url: "http://129.28.35.195:3000/",
          }).then((res) => {});
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
    clearModel: function () {
      this.form_model = {
        question_id: "",
        forum_id: "",
        question_title: "",
        question_content: "",
      };
    },
    getData: function () {
      let questionData = JSON.parse(localStorage.getItem("questionData"));
      if (questionData) {
        this.tableData = questionData;
        this.total = questionData.length;
      } else {
        this.getNewData();
      }
    },
    getNewData: function () {
      this.axios({
        method: "get",
        url: "question/",
      }).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.data.length;
        this.$store.dispatch("setquestionData", res.data.data);
      });
    },
    current_change: function (currentPage) {
      this.currentPage = currentPage;
    },
    handleAdd: function () {
      let M = this.Table_Model_Visible;
      M === true
        ? (this.Table_Model_Visible = false)
        : ((this.Table_Add_Visible = true), (this.Table_Model_Visible = true));
    },
    handleEdit(scope_$index, scope_row) {
      this.form_model = scope_row;
      this.currentQuestion_id = scope_row.question_id;
      this.form_model.question_content = scope_row.question_content;
      this.form_model.question_content = scope_row.question_content;
      this.Table_Add_Visible = false;
      this.Table_Model_Visible = true;
    },
    handleDelete: function (scope_$index, scope_row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("question/" + scope_row.question_id).then((res) => {
            if (res.data["code"] == 200) {
              this.getNewData();
              axios({
                method: "get",
                url: "http://129.28.35.195:3000/",
              }).then((res) => {});
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
  margin-top: 100px;
  margin-bottom: 100px;
}
.add_form_contanier {
  position: relative;
  width: 80%;
  left: 10%;
  top: 30px;
  text-align: left;
}
</style>
