const { defineConfig } = require('unocss')
const presetMpx = require('@mpxjs/unocss-base').default

module.exports = defineConfig({
  content: {
    pipeline: {
      include: [/\.mpx($|\?)/]
    }
  },
  presets: [presetMpx()]
})
