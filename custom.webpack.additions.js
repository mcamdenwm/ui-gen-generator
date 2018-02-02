module.exports = {
  entry: ['babel-polyfill', './src/renderer/index.js'],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            // Here, we include babel plugins that are only required for the
            // renderer process. The 'transform-*' plugins must be included
            // before react-hot-loader/babel
            'transform-class-properties',
            'transform-es2015-classes',
            'transform-object-rest-spread'
          ],
          presets: ['react']
        }
      }
    }, {
      test: /\.woff2?$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 50000,
        },
      },
    }]
  }
}