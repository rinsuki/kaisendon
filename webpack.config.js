const path = require("path")

const entries = [
    "client",
    "oauth_callback",
]

module.exports = {
    mode: "development",
    entry: entries.reduce((prev, current) => ({
        ...prev,
        [current]: path.resolve(__dirname, "src/"+current),
    }), {}),
    output: {
        path: path.resolve(__dirname, "public/webpack"),
        filename: "[name].js",
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
