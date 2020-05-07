<template>
  <div class="outBox">
    <div class="innerBox">
      <img-box />
      <login-box />
    </div>
  </div>
</template>

<style scoped>
.outBox {
  background-color: #fffffe;
  width: 100%;
  height: 100%;
}
.innerBox {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  overflow: hidden;
  height: 30vw;
  border-radius: 1.2vw;
  display: flex;
  flex-flow: row;
  -webkit-box-shadow: 1px 2px 2px 1.4px #d1cece;
  -moz-box-shadow: 1px 2px 2px 1.4px #d1cece;
  box-shadow: 1px 2px 2px 1.4px #d1cece;
}
</style>

<script>
import LoginBox from "./components/loginBox";
import ImgBox from "./components/imgbox.vue";
export default {
  name: "Login",
  components: {
    LoginBox,
    ImgBox,
  },
  data() {
    return {};
  },
};
</script>
