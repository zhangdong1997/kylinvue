import Vue from 'vue'
import App from './App.vue'
import vueRouter from 'vue-router'
import Login from './login.vue'
import Home from './home.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import axios from 'axios'
Vue.use(ElementUI);
Vue.use(vueRouter);
Vue.prototype.$ajax=axios;
const routes = [
  {
    path:"/",component:Login
  },
  {
    path:"/home",component:Home
  }
]

const router =new VueRouter({routes});
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
