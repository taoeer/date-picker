const
	webpackConfig = require('./webpack.dev'),
	webpack = require('webpack'),
	wepbackDevMiddleware = require('webpack-dev-middleware'),
	webpackHotMiddleware = require('webpack-hot-middleware'),
	express = require('express')
  app = express(),
  port = process.env.port || 3003;

webpackConfig.entry.index.unshift('webpack-hot-middleware/client?noInfo=true&reload=true');

const
	compiler = webpack(webpackConfig),
	devMiddleware = wepbackDevMiddleware(compiler, {
	  publicPath: webpackConfig.output.publicPath,
	  stats: {
	    colors: true,
	    chunks: false
	  }
	}),
  hotMiddleware = webpackHotMiddleware(compiler);

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});


app.use(devMiddleware);
app.use(hotMiddleware);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`The server is running at ${port} ......`);
});
