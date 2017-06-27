const
	path = require('path');

module.exports = {
	entry: {
		index: ['./src/index.js']
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{test: /\.js$/, loader: 'babel-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'}
		]
	}
}
