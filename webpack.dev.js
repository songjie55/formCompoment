//关闭多余的代码压缩，提高热更时候的编译速度
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')//链接动态链接库，小项目依赖少的话不需要做动态链接库，不然反而会增加打包后的体积大小

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'main.js'),
    },
    output: {
        filename: "js/bundle-[hash].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: ""
    },
    module: {
        noParse: [/vue\.min\.js$/],
        rules: [
            {
                test: /\.js$/,
                use: ['cache-loader', {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env'],
                        env: {
                            development: {
                                plugins: ['dynamic-import-node']
                            }
                        },
                        plugins: [
                            [
                                "component",
                                {
                                    "libraryName": "element-ui",
                                    "styleLibraryName": "theme-chalk",
                                    "module": false
                                }
                            ],
                            [require("@babel/plugin-proposal-decorators"), {"legacy": true}]
                        ]
                    }
                }],
                exclude: '/node_modules/'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        publicPath: '../css',
                        outputPath: 'css',
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],//less-loader和postcss-loader两者的顺序无所谓谁前谁后
                exclude: '/node_modules/'
            },
            {
                test: /\.(gif|jpg|png|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images',
                            esModule: false//不然会出现[object module]
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: ['cache-loader', 'vue-loader']
            }
        ]
    },
    devtool: 'hidden-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "initial"
                },
                common: {
                    name: `common`,
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    },
    plugins: [
        //配置动态链接库，注意版本配置会有所不同
        new DllReferencePlugin({
            context: __dirname,
            scope: '_dll_vue',//链接库要暴露出来的全局对象名，和dll的library必须一样
            manifest: require('./dist/dll/vue.manifest.json')
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template.html')
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js', '.json', '.vue', '.css', '.less'], // 模块的后缀名
        alias: {
            'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js')
        }
    },
    devServer: {
        contentBase: "./dist",
        port: 3000,
        hot: true,
        host: '0.0.0.0',//允许局域网别的客户端服务
        hotOnly: true, // 模块更新，不会做页面刷新
        compress: true,//gzip
        liveReload: false//检测到文件更改时，开发服务器将重新加载/刷新页面。
    }
}
