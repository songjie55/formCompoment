const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin')
//构建动态链接库
module.exports = {
    entry: {'vue': ['vue']},
    output: {
        path: path.resolve(__dirname, 'dist/dll'),
        filename: "[name].dll.js",
        library: '_dll_[name]'
    },
    plugins: [
        new DllPlugin({
            name: "_dll_[name]",//这名字得和library里面的一样
            path: path.join(__dirname, 'dist', 'dll/[name].manifest.json')
        })
    ]
}