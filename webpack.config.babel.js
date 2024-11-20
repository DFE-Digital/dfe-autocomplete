import webpack from 'webpack'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
const ENV = process.env.NODE_ENV || 'development'

const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  })
]

const developmentPlugins = [
  new CopyWebpackPlugin({
    patterns: [{ from: './autocomplete.css', to: 'dfe-autocomplete.min.css' }]
  })
]

const config = {
  context: path.resolve(__dirname, 'src'),

  optimization: {
    minimize: ENV === 'production',
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          nameCache: {},
          compress: {
            negate_iife: false,
            properties: false
          },
          sourceMap: true,
          output: {
            comments: false
          }
        }
      })
    ]
  },

  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  stats: { colors: true },

  node: {
    global: true,
    __filename: false,
    __dirname: false
  },

  mode: ENV === 'production' ? 'production' : 'development',
  devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    setup (app) {
      // Grab potential subdirectory with :dir*?
      app.get('/dist/:dir*?/:filename', (request, response) => {
        if (!request.params.dir || request.params.dir === undefined) {
          response.redirect('/' + request.params.filename)
        } else {
          response.redirect(
            '/' + request.params.dir + '/' + request.params.filename
          )
        }
      })
    },
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    publicPath: '/dist/',
    contentBase: ['./src'],
    historyApiFallback: true,
    open: true,
    watchContentBase: true,
    disableHostCheck: true
  }
}

const bundleStandalone = {
  ...config,
  entry: {
    'dfe-autocomplete.min': './wrapper.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  plugins: plugins.concat(ENV === 'development' ? developmentPlugins : [])
}

module.exports = [bundleStandalone]
