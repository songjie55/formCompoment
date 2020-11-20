module.exports = {
  root: true, // 根文件，不会往上一层查找
  parser: "vue-eslint-parser",//只有添加这个才能让eslint抛出vue对应的错误
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['plugin:vue/vue3-recommended','eslint:recommended'],//两个规则库一起用，第二个就是下面自己写的规则
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'for-direction': 2,
    "eqeqeq": 2, // 必须使用全等
    "no-console": 2 //不允许出现console语句
  }
}
