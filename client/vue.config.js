module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: '../api/public',
  devServer: {
    proxy: {
      '^/api/*': {
          target: 'http://localhost:4000',
          secure:false,
          pathRewrite: {'^/api': '/'},
          logLevel: 'debug' 
      }
    }
  }
}