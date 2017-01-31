const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|sass)$/,
        loader: DEBUG ? 'style!css!sass' : ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  devTool: 'source-map',
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin('./style/style.css', {
      allChunks: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
