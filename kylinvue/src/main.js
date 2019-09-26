import Vue from 'vue'
import App from './App.vue'
import vueRouter from 'vue-router'
import Login from './login.vue'
import Home from './home.vue'
import User from './component/User.vue'
import Role from './component/role.vue'
import Log from './component/Log.vue'
import ElementUI from 'element-ui';
import {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import axios from 'axios'
import store from './store'
Vue.use(ElementUI);
Vue.use(vueRouter);
Vue.prototype.$ajax = axios;
axios.defaults.withCredentials = true
const routes = [
  {
    path: "/", component: Login
  },
  {
    path: "/home", component: Home,
    children: [
      {
        path: '/', name: '', component: Home, children: [
          {
            path: '/user', component: User, name: ''
          },
          {
            path: '/role', component: Role, name: ''
          },
          {
            path: '/log', component: Log, name: ''
          }

        ]
      }
    ]
  }
]

const router = new VueRouter({ routes });

axios.interceptors.response.use(response => {
  // Do something before response is sent
  return response;
}, error => {
  console.log('axios.interceptors.response{}', error.response);
  console.log("222222222222222222222222222222222"+error.response.status);
  if (error.response.status == 401) {
    Message.error("尚未登录");
    localStorage.removeItem('user');
    store.state.rs = [];
    store.state.user = '';
    router.replace({ path: "/" });
    return;
  }
  if(error.response.status==428){
    Message.error(error.response.data.msg);
    return;
  }
  // Do something with response error
  return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
  if (to.path == "/") {
    next();
    return
  }

  var username = store.state.user.username;
  console.log("username==============={}"+store.state.user.username);
  if (username == "尚未登录" || username==undefined) {
    next({ path: "/" });
    return;
  }

  console.log("dddddddd{}", store.state.rs);
  if (store.state.rs.length == 0) {
    console.log("判断后的dddddddd{}", store.state.rs);
    //调用initMenu方法
    initMenu(router, store);
    //延迟1秒加载
    setTimeout(() => {
      next();
    }, 1000);
    return;
  }

  next();

})

//初始化菜单
export const initMenu = () => {
  axios({
    url: "http://localhost:8080/menu/getMenuByUsername",
    method: "get",
  }).then(function (param) {
    console.log("11111111111{}", param);
    if (param) {
      var routes = formRouters(param.data.object);
      console.log("routers是：{}", routes);
      //把vue路由的值赋给vue     router 对象
      router.options.routes[1].children = routes;
      console.log("vue router是：{}", router.options.routes[1].children);
      store.commit('initMenu', routes);
    }
  })
}


export const formRouters = (routers) => {
  //
  console.log("传入的routers对象为：{}", routers);
  //将json格式的数据转化为vue 识别的动态路由格式
  //1.定义一个空数组接收
  let array = [];
  routers.forEach(element => {
    //定义children空数组接收子
    let children = [];
    if (element.menuList && element.menuList instanceof Array) {
      children = formRouters(element.menuList);
    }
    //声明一个r对象
    let r = {
      path: element.path,
      component(resolve) {
        //判断组件component属性开头
        if (element.component.startWith("User")) {
          require(['./component/' + element.component + '.vue'], resolve)
        }
        else if (element.component.startWith("Role")) {
          require(['./component/' + element.component + '.vue'], resolve)
        }
      },
      name: element.name,
      children: children


    }
    array.push(r);
  });

  return array;


}


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
