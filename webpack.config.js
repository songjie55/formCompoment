const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//分离css单独引用

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
                use: [{
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
                exclude: '/node_module/'
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
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', 'postcss-loader'],
                exclude: '/node_module'
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
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[hash].css'
            })
        ]
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
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue', '.css', '.less'], // 模块的后缀名
    },
    devServer: {
        contentBase: "./dist",
        port: 3000,
        hot: true,
        host: '0.0.0.0',//允许局域网别的客户端服务
        hotOnly: true, // 模块刷新，不会做页面刷新
        compress: true
    }
}