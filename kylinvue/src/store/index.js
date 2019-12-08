import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);


export default new Vuex.Store({
    state:{
        user:{
            name:(localStorage.getItem('user')=="null"||localStorage.getItem('user')==null||localStorage.getItem('user')=='')?'尚未登录':JSON.parse(localStorage.getItem('user')).name
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
