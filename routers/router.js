import VueRouter from "vue-router";
import Vue from "vue";
import selectItem from '../page/components/selectItem.vue'

Vue.use(VueRouter);//这段不能少

const routes = [
  { path: '/', component: () => import('../page/index.vue') },
  { path: '/test', component: selectItem }
]

const router = new VueRouter({
  mode: 'hash',
  routes//注意这里是routes
})
export default router
