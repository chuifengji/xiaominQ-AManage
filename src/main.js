import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/reset.css";
import "./assets/styles/dynamic.css";
import "./plugins/element.js";

import store from "./store/index";

Vue.prototype.getToken = function(key) {
  var data = JSON.parse(localStorage.getItem(key));
  if (data !== null) {
    return data.value;
  }
};
router.beforeEach((to, from, next) => {
  let token = Vue.prototype.getToken("token");
  if (to.meta.requireAuth) {
    //如果需要跳转 ，往下走（1）
    if (token) {
      //判断是否登录过，如果有登陆过，说明有token,或者token未过期，可以跳过登录（2）
      if (to.path === "/login") {
        //判断下一个路由是否为要验证的路由（3）
        next("/"); // 如果是直接跳到首页，
      } else {
        //如果该路由不需要验证，那么直接往后走
        next();
      }
    } else {
      //如果没有登陆过，或者token 过期， 那么跳转到登录页
      next("/login");
    }
  } else {
    //不需要跳转，直接往下走
    next();
  }
});
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
Vue.use(global);
