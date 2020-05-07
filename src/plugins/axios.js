"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = "//122.152.250.71:9091/";
//axios.defaults.headers["Content-Type"] = "multipart/form-data";
Vue.config.productionTip = false;
axios.defaults.transformRequest = [
  function(data) {
    let src = "";
    for (let item in data) {
      src +=
        encodeURIComponent(item) + "=" + encodeURIComponent(data[item]) + "&";
    }
    return src;
  },
];
let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);
let token = "";
_axios.interceptors.request.use(
  function(config) {
    try {
      token = JSON.parse(localStorage.getItem("token"))["value"];
    } catch {
      console.log("localhost获取失败");
    }
    if (token) {
      config.headers["token"] = token; //将token放到请求头发送给服务器
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
