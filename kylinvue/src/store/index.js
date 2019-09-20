import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);


export default new Vuex.Store({
    state:{
        user:{
            username:(localStorage.getItem("user")==null||localStorage.getItem("user")=="null"||localStorage.getItem('user')=='')?"尚未登录":localStorage.getItem("user").username,
        },
        rs:[]
    },
    mutations:{
        login(state,user){
             state.user = user;
             localStorage.setItem("user",JSON.stringify(user));
        },initMenu(store,routers){
            store.rs = routers;
        }
    }

})
