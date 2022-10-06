const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");
const defaultConfig = require("./webpack.config.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const packageConfig = Object.assign(defaultConfig, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "package", "dist"),
        filename: "[name].js",
        library: {
            name: "modal-window",
            type: "umd"
        },
        clean: true
    },

    entry: {
        "modal-window": path.resolve(__dirname, "package", "modal-window")
    },

    plugins: [
        new MiniCssExtractPlugin()
    ],

    externals: {
        "@knownout/lib": {
            commonjs: "@knownout/lib",
            commonjs2: "@knownout/lib",
            amd: "@knownout/lib"
        },
        "@knownout/modal-window-controller": {
            commonjs: "@knownout/modal-window-controller",
            commonjs2: "@knownout/modal-window-controller",
            amd: "@knownout/modal-window-controller"
        },
        "react": {
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        },
        "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "react-dom"
        },
        "mobx-react-lite": {
            commonjs: "mobx-react-lite",
            commonjs2: "mobx-react-lite",
            amd: "mobx-react-lite"
        },
        "mobx": {
            commonjs: "mobx",
            commonjs2: "mobx",
            amd: "mobx"
        }
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            })
        ]
    }
});

packageConfig.module.rules[1].use.options.configFile = "tsconfig.package.json";
module.exports = packageConfig;
