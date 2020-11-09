const path = require('path')
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
                exclude: '/node_module'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
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
                filename:'css/[name]-[hash].css'
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
        })
    ],
    devServer: {
        port: 3000,
        hot: true,
        host: '0.0.0.0'
        // compress: true,
        // cache: true
    }
}