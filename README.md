# -webpack-vue
搭建vue；使用webpack自定义vue；

#使用webpack 4搭建了一个vue项目，搭建过程如下： 
1.安装node，然后使用npm init （初始化项目）；

npm init
2.npm i webpack vue vue-loader，同级创建src（建app.vue及index.js文件）、config（建webpack.config.base.js、webpack.config.dev.js、webpack.config.build.js）

npm i webpack  vue vue-loader
3.新建src文件，在src中创建app.vue、index.js app.vue中写入代码：

<template>
   <div id="test">{{test}}</div>
<template>
<script>
    export default {
        data(){
            return{
                test:'vueDemo'
            }
        }
    }
</script>

<style>
   #test{
       color:red;
   }
</style>
index.js中写入

import Vue from 'vue'
import app from './app.vue'
new Vue({
    render:(h)=>h(app)
})
4.新建config目录，目录中创建webpack.config.base.js、webpack.config.dev.js、webpack.config.build.js ①webpack.config.base.js：这里用来配置开发和生产中的公共webpack配置，我们需要用到以下插件

npm i url-loader file-loader html-webpack-plugin
简单配置如下：

const path=require('path')
const {VueLoaderPlugin}=require('vue-loader')
const HtmlWebpackPlugin=require('html-webpack-plugin')
module.exports={
    //输入
    entry:{
        path:path.join(__dirname,'../src/index.js'),
    },
    //输出
    output:{
        path:path.join(__dirname,'../dist'),
        filename:'bundle.js'
    },
    resolve: {
     alias:{
            'vue$':'vue/dist/vue.esm.js'//配置别名 确保webpack可以找到.vue文件
         },
        extensions: ['.js', '.jsx','.json']
    },
    mode:process.env.NODE_ENV,
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:'vue-loader'
            },
            {
                test:/\.(png|jpg|jepg|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,  //这里的单位是b
                            name:'images/[name][hash].[ext]' //打包后输出路径
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template:'./index.html',
            inject: 'body',
            minify: {
                removeComments: true
            }
        })
    ]
}
②webpack.config.dev.js，这里我们需要将base的配置合并到dev中，需要用到webpack-merge

npm i webpack-merge
下载好后，还需安装css-style style-loader,用来解析css文件

npm i style-loader css-loader
再配置开发环境，需用到webpack-dev-server

npm i webpack-dev-server
dev中简单配置如下：

const base=require('./webpack.config.base')
const merge=require('webpack-merge')
const webpack=require('webpack')

module.exports=merge(base,{
    devServer:{
        port:8089,
        host:'127.0.0.1',
        open:true,
        hot:true,
        overlay:{erros:true}
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
})
现我们需要执行开发启动命令 npm run dev，所以我们还需要用到一个设置当前执行环境的插件cross-env

npm  i  cross-env

下载好后，再package.json中配置：

 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config config/webpack.config.dev.js"
  },
执行npm run dev,，报错 缺少webpack-cli，安装webpack-cli

npm webpack-cli
再执行，还是报错 缺少vue-template-compiler，安装vue-template-compiler

npm i vue-template-compiler
再执行npm run dev 可正常访问了，下面我们来安装vue-router

npm i vue-router
我们创建router目录，里面再创建router.js

import Vue from 'vue'
import Router from 'vue-router'
import Home from '../compnonts/home/index.vue'
import Mine from '../compnonts/mine/index.vue'
Vue.use(Router);
export default new Router({
    routes:[
        {
            path:'/',
            name:'home',
            component:Home
        },
        {
            path:'/mine',
            name:'mine',
            component:Mine
        }
    ]
})
然后index.js 改成

import Vue from 'vue'
import app from './app.vue'
import router from './router/router'

new Vue({
    el:'#app',
    router,
    render:(h)=>h(app)
})
app.vue改成

<template>
   <router-view/>
</template>
<script>
    export default {
      name:'app'
    }
</script>



    
启动到这里我们的开发环境配置的差不多了 ③webpack.config.build.js 首先我们需要把css从代码中分离出来，我们使用mini-css-extract-plugin

npm i mini-css-extract-plugin
每次打包后清除dist文件，安装clean-webpack-plugin

npm i clean-webpack-plugin
配置打包命令

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config config/webpack.config.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config config/webpack.config.build.js"
  },
现在执行下npm run build，已经可以正常打包了，我们把node_modules单独打包。build的简单配置如下：

const base=require('./webpack.config.base')
const merge=require('webpack-merge')
const MiniCssExtractPlugin =require('mini-css-extract-plugin')
const {CleanWebpackPlugin}=require('clean-webpack-plugin')

module.exports=merge(base,{
    output:{
        filename:'js/[name][hash].js',
        chunkFilename:'js/vendor[id][hash].js'
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true
            },
            vendor:{
              test: /node_modules/,
              name: 'vendor',
              chunks:'all'
          }
        }
        }
      },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    {loader:MiniCssExtractPlugin.loader},
                    'css-loader'
                     ]
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({filename:'css/[hash].css'}),
        new CleanWebpackPlugin()
    ]
})
