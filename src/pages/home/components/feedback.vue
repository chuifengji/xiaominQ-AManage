<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      tooltip-effect="dark"
      style="width: 100%;font-size:12px"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" min-width="12%"></el-table-column>
      <el-table-column prop="feedback_id" label="反馈序号" min-width="14%"></el-table-column>
      <el-table-column prop="feedback_type" label="反馈类型" min-width="18%"></el-table-column>
      <el-table-column prop="feedback_question" label="反馈问题" min-width="24%"></el-table-column>
      <el-table-column prop="is_handled" label="是否解决" min-width="14%"></el-table-column>
      <el-table-column label="操作" min-width="20%" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">处理</el-button>
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
  </div>
</template>

<script>
export default {
  name: "Feedback",
  data() {
    return {
      tableHeight: 0,
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
  },
  methods: {
    getData: function() {
      let feedbackData = JSON.parse(localStorage.getItem("feedbackData"));
      if (feedbackData) {
        this.tableData = feedbackData;
        this.total = feedbackData.length;
      } else {
        this.getNewData();
      }
    },
    getNewData: function() {
      this.axios({
        method: "get",
        url: "feedback/"
      }).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.data.length;
        this.$store.dispatch("setfeedbackData", res.data.data);
      });
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    handleEdit: function(scope_$index, scope_row) {
      this.$confirm("确认已经处理了吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios({
            method: "put",
            url: "feedback/" + scope_row.feedback_id
          }).then(res => {
            if (res.data["status_code"] == 200) {
              this.getNewData();
              this.$message({
                type: "success",
                message: "处理成功!",
                showClose: true
              });
            } else {
              this.$message({
                type: "info",
                message: "处理失败!",
                showClose: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            showClose: true
          });
        });
    },
    handleDelete: function(scope_$index, scope_row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.delete("feedback/" + scope_row.feedback_id).then(res => {
            if (res.data["status_code"] == 200) {
              this.getNewData();
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
    handleSelectionChange: function(l, s) {},
    mounted: function() {
      this.addUser();
    }
  }
};
</script>

<style></style>
