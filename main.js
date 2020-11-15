import Vue from 'vue'
import index from "./page/index.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from "vue-axios";
import mixinOptions from "./mixin/mixin";
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
new Vue({
    mixins: [mixinOptions],
    render: h => h(index)
}).$mount('#app')