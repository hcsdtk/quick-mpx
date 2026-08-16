/* global process */

export interface AppConfig {
  apiUrl: string
  httpCode: {
    success: number
  }
}

const config: AppConfig = {
  apiUrl: process.env.VUE_APP_API_URL || 'https://plan.haosesalad.com',
  httpCode: {
    success: 0
  }
}

export default config
