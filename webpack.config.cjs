const path = require('path')

const distDir = path.resolve(__dirname, 'public/bundles')
const publicDir = path.resolve(__dirname, 'public')

module.exports = {
  entry: {
    main: './client/index.js'
  },

  devtool: 'source-map',
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all'
    }
  },

  devServer: {
    contentBase: publicDir
  },

  output: {
    filename: '[name].js',
    path: distDir
  }
}
