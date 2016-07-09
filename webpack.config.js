/* eslint-env node */

"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const resolve = require("path").resolve
const routes = require("./package.json").routes[ENVIRONMENT]
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

const buildDirectory = exports.buildDirectory = "dist"

exports.devtool = "source-map"

exports.entry = {}

exports.module = {
  loaders: [],
  noParse: /\.min\.js/
}

exports.output = {
  path: resolve(__dirname, buildDirectory),
  publicPath: "/",
  libraryTarget: "umd",
  umdNamedDefine: true
}

exports.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
  })
]

exports.resolve = {
  extensions: ["", ".js", ".json"],
  modules: [resolve(__dirname, "app"), "node_modules"]
}

exports.stylus = {
  use: [require("nib")()],
  import: ["~nib/lib/nib/index.styl"]
}

exports.module.loaders.push(
  {test: /\.pug$/, loader: "jade-loader", exclude: /node_modules/},
  {test: /\.png|jpe?g|gif$/i, loader: "url-loader?limit=0", exclude: /node_modules/},
  {test: /\.js$/, loader: "babel-loader", exclude: /node_modules/},
  {test: /\.svg$/, loader: "svg-inline", exclude: /node_modules/},
  {test: /\.styl$/, loader: "css-to-string!css!autoprefixer!stylus-loader?paths=app/resources/"}
)

if (ENVIRONMENT === "development") {
  exports.devtool = "eval"

  exports.entry = ["./app/development.js"]

  Object.assign(exports.output, {
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  })

  exports.plugins.push(
    new HtmlWebpackPlugin({
      template: "app/index.pug"
    })
  )

  exports.module.preLoaders = [{
    exclude: /node_modules/,
    loader: "eslint-loader",
    test: /\.js$/
  }]

  exports.entry.unshift(`webpack-dev-server/client?http://0.0.0.0:${routes.views.port}`)
}
