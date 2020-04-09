const BaseConfig = require("./webpack.config.base.js");
const Merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = Merge(BaseConfig, {
    output: {
        filename: 'js/[name][hash].js',
        chunkFilename: 'js/vendor[id][hash].js'
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
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/[hash].css' }),
        new CleanWebpackPlugin()
    ]
})
