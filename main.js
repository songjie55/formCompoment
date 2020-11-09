import Vue from 'vue'
import index from "./page/index.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


new Vue(
    {render: h => h(index)}
).$mount('#app')