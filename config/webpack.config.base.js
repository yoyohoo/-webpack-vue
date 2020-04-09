const Path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const babelPolyfill = require('babel-polyfill');

module.exports = {
    /**
     * 输入
     */
    entry: {
        app: ["babel-polyfill", "./src/index.js"]
        // path: Path.join(__dirname, "../src/index.js")
    },
    /**
     * 输出
     */
    output: {
        path: Path.join(__dirname, "../dist"),
        filename: 'bundle.js'
    },
    resolve: {
        /**
         * 配置vue别名，确保webpack找到.vue文件
         */
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: [".js", ".jsx", ".json"]
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                loader: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1024,
                            name: "images/[name][hash].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: '自己搭建VUE框架',
            inject: "body",
            hash: true,
            minify: {
                removeComments: true
            }
        })
    ]
}
