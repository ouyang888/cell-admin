module.exports = {
  // 选项...
  // 基本路径
  publicPath: './',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/dms': {
        target: 'https://changhejiaju.com.cn/dms',
        changeOrigin: true,
        pathRewrite: {
          '^/dms': ''
        }
      },
    }
  },
  outputDir: 'inspectionClient'
}