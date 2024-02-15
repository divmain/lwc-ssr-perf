const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  devtool: false,
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    library: {
      name: 'ReactExample',
      type: 'umd',
      export: ['default'],
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};