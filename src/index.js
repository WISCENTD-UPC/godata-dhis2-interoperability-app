import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker'

import 'typeface-roboto'

const baseUrl = process.env.REACT_APP_DHIS2_BASE_URL
const appName = process.env.REACT_APP_DHIS2_APP_NAME
const apiVersion = parseInt(process.env.REACT_APP_DHIS2_API_VERSION, 10)

const config = {
  baseUrl: baseUrl,
  apiVersion: apiVersion
}

ReactDOM.render(
  <App config={ config } appName={ appName }/>,
  document.getElementById("root")
)

serviceWorker.unregister()