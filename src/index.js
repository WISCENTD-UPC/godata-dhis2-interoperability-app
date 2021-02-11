import React from 'react'
import ReactDOM from 'react-dom'
import { init } from 'd2'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

import 'typeface-roboto'

const baseUrl = process.env.REACT_APP_DHIS2_BASE_URL
const appName = process.env.REACT_APP_DHIS2_APP_NAME
const apiVersion = process.env.REACT_APP_DHIS2_API_VERSION

const config = {
  baseUrl: baseUrl,
  apiVersion: apiVersion
}

init({ baseUrl: baseUrl + '/api/' })
  .then(d2 => {
    if (!d2.dataStore.has("interoperability")) {
      d2.dataStore.create("interoperability")
        .then(namespace => {
          namespace.set('isOk', true)
        })
    }
  })

ReactDOM.render(
  <App config={ config } appName={ appName }/>,
  document.getElementById("root")
)

serviceWorker.unregister()