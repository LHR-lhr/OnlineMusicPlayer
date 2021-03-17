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
      },
      host: '127.0.0.1', // can be overwritten by process.env.HOST
      port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    }
}
