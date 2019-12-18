module.exports = {
    devServer: {
      proxy: {
        '/api': {
          // http://tingapi.ting.baidu.com
          target: 'http://tingapi.ting.baidu.com/', //API服务器的地址
          changeOrigin: true,
           ws: true,
          pathRewrite: {
              '^/api': ''
          }
        }
      }
    }
}
