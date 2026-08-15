const path = require('path')

module.exports = {
  // Keep each target self-contained so the generated directory can be opened
  // directly by the corresponding mini-program developer tool.
  outputDir: `dist/${process.env.MPX_CURRENT_TARGET_MODE || 'wx'}`,
  configureWebpack: {
    performance: {
      hints: false
    }
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
