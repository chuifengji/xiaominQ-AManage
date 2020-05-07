<template>
  <div class="header-outBox mdui-ripple">
    <div class="header-title-box">
      <img
        class="header-icon"
        src="../../../assets/images/logo.png"
      />小民问答后台管理
    </div>
    <div class="header-nav-box">
      <div
        class="header-nav-item"
        @click="changeCurrentIndex(0)"
        style=":hover:{rgb(179, 216, 255)}"
      >
        导航栏
      </div>

      <div
        class="header-nav-item"
        @click="changeCurrentIndex(1)"
        :class="currentIndex == 1 ? 'active' : ''"
      >
        板块内容
      </div>
      <div class="header-nav-item" @click="changeCurrentIndex(2)">问题详细</div>

      <div class="header-nav-item" @click="changeCurrentIndex(3)">反馈内容</div>
    </div>
    <el-tooltip
      class="item"
      effect="dark"
      content="退出登录，bye~"
      placement="right"
    >
      <div class="header-sign-out-box" @click="signOut">退出</div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: "headerMain",
  data() {
    return {
      currentIndex: 0,
    };
  },
  mounted() {},
  methods: {
    changeCurrentIndex(index) {
      this.currentIndex = index;
      switch (index) {
        case 0:
          this.$router.push("/");
          break;
        case 1:
          this.$router.push("/Plate");
          break;
        case 2:
          this.$router.push("/Question");
          break;
        case 3:
          this.$router.push("/Feedback");
          break;
        case 4:
          this.$router.push("/AddItem");
          break;
      }
    },
    signOut() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!",
            showClose: true,
          });
        })
        .catch(() => {});
    },
  },
  components: {},
};
</script>
<style scoped>
.header-outBox {
  width: 100vw;
  height: 4.2vw;
  line-height: 4.2vw;
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 999;
  top: 0;
  color: #ffffff;
}
.header-icon {
  width: 2.6vw;
  height: 2.6vw;
  margin-right: 0.6vw;
  position: relative;
}
.header-title-box {
  width: 22vw;
  height: 4.2vw;
  font-size: 1.5vw;
  text-align: left;
  background-color: #409effd6;
  box-sizing: border-box;
  padding-left: 3vw;
  font-weight: 400;
}

.header-sign-out-box {
  width: 6vw;
  background-color: #409effd6;
  font-size: 1.2vw;
  font-weight: 200;
  padding-right: 4.2vw;
}
.header-sign-out-box:active {
  font-size: 1.1vw;
}
.header-nav-box {
  position: relative;
  overflow: hidden;
  text-align: left;
  flex: 1;
  height: 4.2vw;
  background-color: #409effd6;
  color: #ffffff;
  display: flex;
  flex-direction: row;
}
.header-nav-item {
  width: 7vw;
  color: #ffffff;
  font-size: 1.3vw;
  text-align: center;
}
.header-nav-item:hover {
  background-color: rgb(140, 197, 255);
}
</style>
