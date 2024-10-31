const path = require('path');

module.exports = {
  entry: './public/content.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'content.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};