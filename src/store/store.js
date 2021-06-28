import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


const store =new Vuex.Store({
    state:{
        avatarImg:"",
        id:"",
        realName:"",
        username:"",
        password:"",
        Allfriends:[],
        Sessionmes:[],
        history:[],
    },
    mutations:{
        updateimg(state,avatarImg){
            state.avatarImg=avatarImg;
            sessionStorage.setItem('avatarImg',avatarImg);
        },
        updateid(state,id){
            state.id=id;
            sessionStorage.setItem('id',id);
           
        },
        updateName(state,realName){
            state.realName=realName;
            sessionStorage.setItem('realName',realName);
        },
        updateAllfriends(state,Allfriends){
             state.Allfriends=Allfriends;
             sessionStorage.setItem("Allfriends", JSON.stringify(Allfriends));
        },
        updateSessionmes(state,Sessionmes){
            state.Sessionmes.push(Sessionmes);
            sessionStorage.setItem("Sessionmes", Sessionmes);
        },
        updateusername(state,username){
            state.username=username;
            sessionStorage.setItem('username',username);
        },
        updatepassword(state,password){
            state.password=password;
            sessionStorage.setItem('password',password);
        },
        updatehistory(state,history){
            state.history=history;
            sessionStorage.setItem('history',history);
        },

    },
    getters:{
        getavatarImg:(state)=>state.avatarImg,
        getid:(state)=>state.id,
        getrealName:(state)=>state.realName,
        getAllfriends:(state)=>state.Allfriends,
        getSessionmes:(state)=>state.Sessionmes,
        getusername:(state)=>state.username,
        getpassword:(state)=>state.password,
        gethistory:(state)=>state.history, 
    }
})

export default store
