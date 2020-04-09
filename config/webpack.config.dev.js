const BaseConfig = require("./webpack.config.base");
const Merge = require("webpack-merge");
const Webpack = require("webpack");

module.exports = Merge(BaseConfig, {
    devServer: {
        port: 8089,
        host: "127.0.0.1",
        open: true,
        hot: true,
        overlay: { errors: true }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
})
