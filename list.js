import Vue from "vue";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import VueAxios from "vue-axios";
import list from "./page/list";
import mixinOptions from "./mixin/mixin";

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
new Vue({
    mixins: [mixinOptions],
    render: h => h(list)
}).$mount('#app')