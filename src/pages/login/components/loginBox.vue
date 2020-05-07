<template>
  <div class="outBox">
    <div class="titleBox">小民问答后台</div>
    <div class="input-box-account">
      <el-input
        v-model="inputAccount"
        maxlength:50
        placeholder="请输入账号"
      ></el-input>
    </div>
    <div class="input-box-password">
      <el-input
        placeholder="请输入密码"
        v-model="inputPassword"
        show-password
        maxlength:50
      ></el-input>
    </div>
    <button class="signBox" @click="pageToHome">登&nbsp;入</button>
  </div>
</template>

<style scoped>
.outBox {
  width: 26vw;
  height: 30vw;
  position: relative;
  background-color: #fffffe;
}
.titleBox {
  height: 2vw;
  font-size: 1.4vw;
  text-align: center;
  line-height: 2vw;
  margin-top: 2.8vw;
  margin-bottom: 2vw;
}
.self-input {
  box-sizing: border-box;
  font-size: 1.1vw;
  padding: 1vw;
  height: 2.8vw;
  width: 18vw;
  margin-top: 2vw;
  margin-left: 4vw;
  margin-right: 4vw;
  border: 1px solid #dcf0ff;
  border-radius: 1.4vw;
}
.input-box-password {
  width: 18vw;
  position: relative;
  margin-top: 2vw;
  margin-left: 4vw;
  margin-right: 4vw;
}
.input-box-account {
  width: 18vw;
  position: relative;
  margin-top: 4vw;
  margin-left: 4vw;
  margin-right: 4vw;
}
.outBox /deep/ .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  color: #606266;
  display: inline-block;
  box-sizing: border-box;
  height: 2.8vw;
  width: 18vw;
  line-height: 2.8vw;
  border: 1px solid #dcf0ff;
  border-radius: 1.4vw;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.outBox /deep/ .el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 18vw;
}

.signBox {
  height: 2.8vw;
  background-color: #3da9fc;
  color: #fffffe;
  width: 18vw;
  margin-top: 4vw;
  margin-left: 4vw;
  margin-right: 4vw;
  border-radius: 1.4vw;
  font-size: 1.2vw;
  opacity: 0.8;
}
.signBox:active {
  opacity: 1;
}
.fontText {
  font-size: 0.8vw;
  text-align: center;
  margin-top: 0.8vw;
}
.font {
  display: inline;
}
.font_color {
  color: #3da9fc;
}
</style>

<script>
export default {
  name: "LoginBox",
  data() {
    return {
      inputPassword: "",
      inputAccount: "",
    };
  },
  methods: {
    pageToHome() {
      let username = this.inputAccount;
      let password = this.inputPassword;
      let params = { admin_name: username, admin_password: password };
      let dd = new Date();
      let date = dd.getTime();
      if (!username | !password) {
        this.$message({
          message: "警告哦，账号密码不能为空哦",
          type: "warning",
        });
      } else if (!/^[0-9a-zA-Z_]{6,18}$/.test(password)) {
        this.$message({
          message: "警告哦,密码只能由6-18位数字/字母/下划线组成",
          type: "warning",
        });
      } else {
        this.axios({
          method: "get",
          url: "login/",
          params: params,
        }).then((res) => {
          console.log(res.data["code"]);
          if (res.data["code"] == 1000) {
            this.set("token", res.data["token"]);
            this.$router.push({ path: "/" });
          } else {
            this.$message.error("错了哦，账号密码不太对呢");
          }
        });
      }
    },
    set(key, value) {
      var data = { value: value };
      localStorage.setItem(key, JSON.stringify(data));
    },
  },
};
</script>
