import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import Regsiter from '../views/register.vue'
import Chat from '../views/chat.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: "login",
    component: login,
  }, {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/register',
    name: "register",
    component: Regsiter
  },
  {
    path: '/chat',
    name: "chat",
    component: Chat
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {

  if (to.name == 'login') {
    next();
    return;
  }
  let name=sessionStorage.getItem('id');

  if(name==undefined&&to.path!='login'){
     next('/login');
  }
  next();
})


export default router
