const path = require('path');
const webpack = require('webpack');

let config = {
  mode: 'development',
  entry: ['webpack-hot-middleware/client?reload=true', path.resolve(__dirname, './src/index.js')],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public'),
    publicPath: 'auto',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images/'
            }
          }
        ]
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    contentBase: "public",
    overlay: true,
    hot: true
  },
};

/* if (Boolean(process.env.NODE_ENV)) {
  config.entry.unshift('webpack-hot-middleware/client?reload=true');
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin()
  )
} else {
  throw Error("This project isnt ready for prodution. Change NODE_ENV to true");
} */

module.exports = config;