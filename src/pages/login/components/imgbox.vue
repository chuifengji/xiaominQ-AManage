<template>
  <div>
    <div class="imgBox">
      <div class="img"></div>
    </div>
    <div class="skipBack"></div>
  </div>
</template>

<script>
export default {
  name: "ImgBox",
  methods: {},
};
</script>

<style scoped>
.imgBox {
  width: 26vw;
  height: 30vw;
  background-color: #fffffe;
}
.img {
  width: 20vw;
  height: 15vw;
  position: relative;
  top: 7.5vw;
  left: 3vw;
  background-image: url("../../../assets/images/login.png");
  overflow: hidden;
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
