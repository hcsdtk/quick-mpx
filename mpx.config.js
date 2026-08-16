const path = require('path')
const MpxUnocssPlugin = require('@mpxjs/unocss-plugin').default

module.exports = {
  // Keep each target self-contained so the generated directory can be opened
  // directly by the corresponding mini-program developer tool.
  outputDir: `dist/${process.env.MPX_CURRENT_TARGET_MODE || 'wx'}`,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.plugin('mpx-unocss-plugin').use(MpxUnocssPlugin, [{}])
  },
  pluginOptions: {
    mpx: {
      plugin: {
        srcMode: 'wx',
        writeMode: 'changed',
        transRpxRules: [
          {
            mode: 'only',
            comment: 'use rpx',
            include: path.resolve(__dirname, 'src')
          }
        ]
      },
      loader: {}
    }
  }
}
