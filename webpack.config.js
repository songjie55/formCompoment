const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//分离css单独引用,这个loader不能喝style-loader一起用
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');//链接动态链接库，小项目依赖少的话不需要做动态链接库，不然反而会增加打包后的体积大小
const HappyPack = require('happypack');//多进程打包

module.exports = {
  mode: 'production',//生产模式下默认开启tree shaking
  entry: {
    index: path.resolve(__dirname, 'main.js')
  },
  output: {
    filename: "js/bundle-[hash].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: ""
  },
  module: {
    noParse: [/vue\.min\.js$/],
    rules: [
      // {
      //     test:/\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     enforce: "pre",//提前预处理，
      //     include:[path.resolve(__dirname,'page'),path.resolve(__dirname,'main.js')],
      //     //eslint检查报告的格式规范
      //     options: {
      //         fix: true,
      //         formatter: require("eslint-friendly-formatter")
      //     }
      // },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],
        exclude: '/node_modules/'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: [{
          loader: "file-loader",
          options: {
            publicPath: '../css',
            outputPath: 'css',
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],//less-loader和postcss-loader两者的顺序无所谓谁前谁后
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
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all"
        },
        common: {
          name: `common`,
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    }
  },
  plugins: [
    //多进程打包
    new HappyPack({
      id: 'babel',
      loaders: [{
        loader: 'babel-loader',
        options: {
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
            [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
          ]
        }
      }]
    }),
    //配置动态链接库，注意版本配置会有所不同
    new DllReferencePlugin({
      context: __dirname,
      scope: '_dll_vue',//链接库要暴露出来的全局对象名，和dll的library必须一样
      manifest: require('./dist/dll/vue.manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html'),
      //html压缩
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/*']//除了dll和dll里面的东西不删除其他清掉
    }),
    //把css当成外联表引入
    new MiniCssExtractPlugin({//这个插件不能和热更一起用，会让Vue中style标签里面的样式不能热更，webpack5自带热更，不需要在plugins里面添加HMR
      filename: 'css/[name]-[hash].css'
    }),
    //css压缩
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require('cssnano')
    }),
    //js压缩
    new UglifyWebpackPlugin({
      exclude: /\/excludes/,
      extractComments: true,
      chunkFilter: (chunk) => {
        // Exclude uglification for the `vendor` chunk
        if (chunk.name === 'vendor') {//第三方依赖库宝可以不压缩看情况选择
          return false;
        }

        return true;
      }
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.json', '.vue', '.css', '.less'], // 模块的后缀名
    alias: {
      'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js')
    }
  }
}
