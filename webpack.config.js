const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    graphsearch: './examples/graphsearch/index.js'
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
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'images/'
      //         // limit: 2048,
      //         // fallback: 'file-loader'
      //       }
      //     }
      //   ]
      // }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: "算法",
    //   // favicon: './src/images/favicon.ico',
    //   template: path.resolve(__dirname, './examples/index.html')
    // })
  ],

  devServer: {
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
    // does not capture runtime errors of the application
    overlay: true
  }
}