import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import list from "./page/list";
import {
    Select,
    Input,
    DatePicker,
    Cascader,
    Option,
    RadioGroup,
    Radio,
    Form,
    FormItem,
    InfiniteScroll
} from 'element-ui';
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
Vue.use(VueAxios, axios)
new Vue({
    mixins: [mixinOptions],
    render: h => h(list)
}).$mount('#app')