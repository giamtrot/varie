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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  watch: true // Optional: enables watch mode
};