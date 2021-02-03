const path = require('path');
const webpack = require('webpack');
const env = require('./dev.env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./config');
// const ip = require('ip');

// const address = ip.address();
// const address = 'local.omex.com';
// const address = 'localhost';
const address = '127.0.0.1';
const mockUrl = 'http://mock.omcoin-inc.com';
base.output.publicPath = `http://${address}:${config.dev.port}/`;

base.plugins.unshift(
  // new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin(env),
  new webpack.HotModuleReplacementPlugin({}),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src'), 'index.html'),
    filename: 'index.html'
  }),
);

module.exports = Object.assign(base, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    hot: true,
    host: address,
    port: config.dev.port,
    proxy: {
      '/rap/*': {
        target: mockUrl,
        changeOrigin: true,
        secure: true,
      },
      '/v2/*': {
        target: config.dev.apiUrl,
        changeOrigin: true,
        secure: true,
      },
      '/tradingview/*': {
        target: 'http://omcombeta.bafang.com/',
        // pathRewrite: { '^/omui-tv/libs': '' },
        changeOrigin: true,
        secure: true,
      },
      '/v3/*': {
        target: config.dev.apiUrl,
        changeOrigin: true,
        secure: true,
      }
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/omexapp/index.html' }
      ]
    }
  },
  devtool: 'source-map'
});
