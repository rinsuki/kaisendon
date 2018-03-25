const path = require("path")

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
        path: path.resolve(__dirname, "public/webpack"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader", options: {
                appendTsSuffixTo: [/\.vue$/],
            } },
            { test: /\.vue$/, loader: "vue-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}