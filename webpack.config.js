const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    graphsearch: './examples/graphsearch/index.js',
    astardemo: './examples/astardemo/index.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src', 'js'),
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
              // limit: 2048,
              // fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'examples/astardemo/assets', to: 'assets' }
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['graphsearch'],
      filename: 'graphsearch.html',
      template: 'examples/graphsearch/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['astardemo'],
      filename: 'astardemo.html',
      template: 'examples/astardemo/index.html'
    })
  ],

  devServer: {
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
    // does not capture runtime errors of the application
    overlay: true
  }
}