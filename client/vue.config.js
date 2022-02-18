module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
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
