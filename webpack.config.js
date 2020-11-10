const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//分离css单独引用,这个loader不能喝style-loader一起用

let miniArr = [new OptimizeCssAssetsWebpackPlugin()]
if (process.env.MODE !== 'development') {
    miniArr.push(new MiniCssExtractPlugin({//这个插件不能和热更一起用，会让Vue中style标签里面的样式不能热更，webpack5自带热更，不需要在plugins里面添加HMR
        filename: 'css/[name]-[hash].css'
    }))
}
module.exports = {
    mode: process.env.MODE === 'development' ? 'development' : 'production',
    entry: {
        index: path.resolve(__dirname, 'main.js'),
    },
    output: {
        filename: "js/bundle-[hash].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: ""
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['cache-loader', {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env'],
                        env: {
                            development: {
                                plugins: ['dynamic-import-node']
                            }
                        },
                        plugins: [
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
                use: [(process.env.MODE === "development" ? 'style-loader' : MiniCssExtractPlugin.loader), 'css-loader']
            },
            {
                test: /\.less$/,
                use: [(process.env.MODE === "development" ? 'style-loader' : MiniCssExtractPlugin.loader), 'css-loader', 'less-loader', 'postcss-loader'],
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
                use: 'vue-loader'
            }
        ]
    },
    devtool: process.env.MODE === 'development' ? 'source-map' : 'eval',
    optimization: {
        minimizer: miniArr,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: '/[\\/]node_modules[\\/]/',
                    priority: -10
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
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template.html')
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new UglifyWebpackPlugin({
            parallel: 4
        }),
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue', '.css', '.less'], // 模块的后缀名
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