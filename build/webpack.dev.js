const
	baseConf = require('./webpack.base'),
  webpack = require('webpack'),
	htmlWebpackPlugin = require('html-webpack-plugin'),
	webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConf, {
  devtool: '#cheap-module-eval-source-map',
	plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
		new htmlWebpackPlugin({
			template: './index.html'
		})
	]
})
