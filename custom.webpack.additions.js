module.exports = {
  entry: ['babel-polyfill', './src/renderer/index.js'],
  module: {
    rules: [{
      test: /\.js/,
      exclude: /node_modules\/(?!@workmarket\/front\-end\-components)/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            // Here, we include babel plugins that are only required for the
            // renderer process.
            'transform-class-properties',
            'transform-es2015-classes',
            'transform-object-rest-spread',
            'dynamic-import-webpack'
          ],
          presets: ['react', 'latest']
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