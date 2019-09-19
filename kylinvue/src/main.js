import Vue from 'vue'
import App from './App.vue'
import vueRouter from 'vue-router'
import Login from './login.vue'
import Home from './home.vue'
import User from './component/User.vue'
import Role from './component/role.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import axios from 'axios'
import store from './store'
Vue.use(ElementUI);
Vue.use(vueRouter);
Vue.prototype.$ajax=axios;
axios.defaults.withCredentials=true
const routes = [
  {
    path:"/",component:Login
  },
  {
    path:"/home",component:Home,
    children:[
      {
        path:'/',name:'',component:Home,children:[
          {
            path:'/user',component:User,name:''
          },
          {
            path:'/role',component:Role,name:''
          }
        ]
      }
    ]
  }
]

const router =new VueRouter({routes});
router.beforeEach((to,from,next)=>{
  if(to.path=="/"){
     next();
     return 
  }

  var username = store.state.user.username;
  if(username=="尚未登录"){
     next({path:"/"});
  }
  next();

})


export const initMenu=()=>{
  axios({
    url:"http://localhost:8080/menu/",
    method:"get",
  }).then(function(param){
       console.log("11111111111{}",param);
       
  })
}


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
