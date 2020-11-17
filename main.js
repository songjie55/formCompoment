import Vue from 'vue'
import index from "./page/index.vue";
import {Select, Input, DatePicker, Cascader,Option,RadioGroup,Radio} from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Select);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Cascader);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(Radio);


new Vue(
    {render: h => h(index)}
).$mount('#app')