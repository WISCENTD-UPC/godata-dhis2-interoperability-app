import React from 'react'
import ReactDOM from 'react-dom'
import { init } from 'd2'
import axios from 'axios'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import dotenv from 'dotenv'

import 'typeface-roboto'

dotenv.config()
const appName = process.env.REACT_APP_DHIS2_APP_NAME
const apiVersion = process.env.REACT_APP_DHIS2_API_VERSION

async function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
      const baseUrl = process.env.REACT_APP_DHIS2_BASE_URL || "http://localhost:8080"
      console.info(`[DEV] DHIS2 instance: ${baseUrl}`)
      return baseUrl.replace(/\/*$/, "")
  } else {
      const { data: manifest } = await axios.get("manifest.webapp")
      return manifest.activities.dhis.href
  }
}
async function main() {
  const baseUrl = await getBaseUrl()
  init({ baseUrl: baseUrl + '/api/' })

  const config = {
    baseUrl: baseUrl,
    apiVersion: apiVersion
  }

  ReactDOM.render(
    <App config={ config } appName={ appName }/>,
    document.getElementById("root")
  )
  serviceWorker.unregister()
}

main()