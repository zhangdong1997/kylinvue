import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);


export default new Vuex.Store({
    state:{
        user:{
            username:localStorage.getItem("user")==null?"尚未登录":localStorage.getItem("user").username,
        }
    },
    mutations:{
        login(state,user){
             state.user = user;
             localStorage.setItem("user",JSON.stringify(user));
        }
    }

})
