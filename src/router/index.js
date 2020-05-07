import Vue from "vue";
import Router from "vue-router";
import Home from "../pages/home/home.vue";
import Login from "../pages/login/login.vue";
import Feedback from "../pages/home/components/feedback.vue";
import Navbar from "../pages/home/components/navbar.vue";
import Plate from "../pages/home/components/plate.vue";
import Question from "../pages/home/components/question.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/Login",
      name: "Login",
      component: Login,
    },
    {
      path: "/",
      name: "Home",
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Home,
      children: [
        {
          path: "/",
          name: "Navbar",
          component: Navbar,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "/Feedback",
          name: "Feedback",
          component: Feedback,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "/Plate",
          name: "Plate",
          component: Plate,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "/Question",
          name: "Question",
          component: Question,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
      ],
    },
  ],
});
