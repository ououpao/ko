const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './app.js'
  ],
  output: {
    path: path.resolve(__dirname, "dist/assets"),
    filename: 'kite.js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      },
      exclude: /node_modules/,
      include: __dirname
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  devServer: {
    port: 8085,
    historyApiFallback: {
      index: '/'
    }
  }
}
