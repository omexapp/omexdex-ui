/**
 * 配置文件
 */
module.exports = {
  dev: {
    // 端口
    port: 5200,
    // 连接后端API的URL
    // apiUrl: 'https://www.omex.com' // 线上数据
    apiUrl: 'http://192.168.80.192' // 测试环境
  },

  daily: {
    publicBasePath: '//daily-test.omcoin-inc.com/cdn/assets/',
  },
  prepub: {
    publicBasePath: '//om-public-hk.oss-cn-hongkong.aliyuncs.com/cdnpre/assets/',
  },
  publish: {
    publicBasePath: '//static.bafang.com/cdn/assets/',
  }
};
