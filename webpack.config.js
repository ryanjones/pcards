var path = require("path");
var webpack = require("webpack");

module.exports = {
    target: "web",
    entry: {
        pcards: "./src/pcards.ts"
    },
    devtool: "source-map",
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        sourceMapFilename: "[file].map"
    },
    externals: [{
        "q": true,
        "moment": true
    },
        /^VSS\/.*/, /^TFS\/.*/
    ],
    resolve: {
        extensions: ["*",".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [path.resolve("./src"),"node_modules"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: { emitErrors: true, failOnHint:true}
                    }
                ]
            },
            { 
                test: /\.handlebars$/, 
                loader: "handlebars-loader" 
            },
            {
                test: /\.tsx?$/, 
                loader: "ts-loader" 
            }
        ]
    }
}