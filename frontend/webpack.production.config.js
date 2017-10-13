const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');
const StatsPlugin = require('stats-webpack-plugin');


module.exports = {
  entry: [
    path.join(__dirname, 'app/main.jsx')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[hash].min.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_HOST': JSON.stringify(process.env.API_HOST || 'localhost'),
      'process.env.API_PORT': JSON.stringify(process.env.API_PORT || '3001'),
      'process.env.WS_HOST': JSON.stringify(process.env.WS_HOST || ''),
      'process.env.WS_PORT': JSON.stringify(process.env.WS_PORT || ''),
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false
    })
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'app', 'server'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /(\.js|\.jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['env', 'stage-0', 'react']
      }
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg)$/, loader: 'file-loader?name=assets/[name].[ext]'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        'style-loader',
        combineLoaders([
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[hash:base64:5]'
            }
          }, {
            loader: 'sass-loader'
          }, {
            loader: 'postcss-loader',
            query: {
              browsers: 'last 2 versions'
            }
          }
        ])
      )
    }
    ]
  },
  postcss: [
    autoprefixer
  ]
};
