const
  baseConf = require('./webpack.base'),
  webpack = require('webpack'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin');
  htmlWebpackPlugin = require('html-webpack-plugin'),
  webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConf, {
  plugins: [
    new UglifyJSPlugin()
  ]
})
