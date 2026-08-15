/* global process */

const config = {
  apiUrl: process.env.VUE_APP_API_URL || 'https://plan.haosesalad.com',
  httpCode: {
    success: 0
  }
}

export default config
