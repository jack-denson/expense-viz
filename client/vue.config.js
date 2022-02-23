module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: '../api/public',
  devServer: {
    proxy: {
      '^/*': {
          target: 'http://localhost:4000',
          secure:false,
          logLevel: 'debug'
      }
    }
  }
}