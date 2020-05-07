<template>
  <div>
    <header-home />
    <div class="main-container-home">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderHome from "./components/header";
export default {
  name: "Home",
  components: {
    HeaderHome,
  },
  beforeCreate() {
    this.axios({
      method: "get",
      url: "forum/",
    }).then((res) => {
      this.$store.dispatch("setplateData", res.data.data);
      this.$store.dispatch(
        "setplateList",
        res.data.data.map((item) => {
          return {
            value: item.forum_id,
            label: item.forum_title,
          };
        })
      );
    });
    this.axios({
      method: "get",
      url: "question/",
    }).then((res) => {
      this.$store.dispatch("setquestionData", res.data.data);
    });
    this.axios({
      method: "get",
      url: "navbar/",
    }).then((res) => {
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
    this.axios({
      method: "get",
      url: "feedback/",
    }).then((res) => {
      this.$store.dispatch("setfeedbackData", res.data.data);
    });
  },
};
</script>

<style>
.main-container-home {
  position: relative;
  top: 4.2vw;
  overflow: auto;
  height: calc(100vh - 4.2vw);
}
</style>
