import Vue from 'vue'
import index from "./page/index.vue";
import {
    Select,
    Input,
    DatePicker,
    Cascader,
    Option,
    RadioGroup,
    Radio,
    FormItem,
    Form,
    InfiniteScroll,
    Checkbox,
    CheckboxGroup
} from 'element-ui';
import axios from 'axios'
import VueAxios from "vue-axios";
import mixinOptions from "./mixin/mixin";

Vue.use(Select);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Cascader);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(InfiniteScroll);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(VueAxios, axios);
new Vue({
    mixins: [mixinOptions],
    render: h => h(index)
}).$mount('#app')