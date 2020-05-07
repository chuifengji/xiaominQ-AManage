import Vue from "vue";
import vuex from "vuex";
Vue.use(vuex);

export default new vuex.Store({
  state: {
    navBarData: [],
    plateData: [],
    questionData: [],
    feedbackData: [],
    navList: [],
    plateList: [],
  },
  actions: {
    setNavBarData(ctx, navBarData) {
      ctx.commit("setNavBarData", navBarData);
    },
    setplateData(ctx, plateData) {
      ctx.commit("setplateData", plateData);
    },
    setquestionData(ctx, questionData) {
      ctx.commit("setquestionData", questionData);
    },
    setfeedbackData(ctx, feedbackData) {
      ctx.commit("setfeedbackData", feedbackData);
    },
    setnavList(ctx, navList) {
      ctx.commit("setnavList", navList);
    },
    setplateList(ctx, plateList) {
      ctx.commit("setplateList", plateList);
    },
  },
  mutations: {
    setNavBarData(state, navBarData) {
      state.navBarData = navBarData;
      try {
        localStorage.setItem("navBarData", JSON.stringify(navBarData));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
    setplateData(state, plateData) {
      state.plateData = plateData;
      try {
        localStorage.setItem("plateData", JSON.stringify(plateData));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
    setquestionData(state, questionData) {
      state.questionData = questionData;
      try {
        localStorage.setItem("questionData", JSON.stringify(questionData));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
    setfeedbackData(state, feedbackData) {
      state.feedbackData = feedbackData;
      try {
        localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
    setnavList(state, navList) {
      state.navList = navList;
      try {
        localStorage.setItem("navList", JSON.stringify(navList));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
    setplateList(state, plateList) {
      state.plateList = plateList;
      try {
        localStorage.setItem("plateList", JSON.stringify(plateList));
      } catch (e) {
        alert("错误：或因关闭本地存储功能而导致");
      }
    },
  },
});
