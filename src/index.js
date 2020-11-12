import {  Provider } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
//import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

//import { init } from 'd2'
import { D2Api } from 'd2-api/2.30'
import { DHIS2API } from 'dhis2-api-wrapper'
import { DHIS2APIConfig } from './config'

const isLangRTL = code => {
    const langs = ["ar", "fa", "ur"]
    const prefixed = langs.map(c => `${c}-`)
    return _(langs).includes(code) || prefixed.filter(c => code && code.startsWith(c)).length > 0
}

const configI18n = ({ keyUiLocale: uiLocale }) => {
    i18n.changeLanguage(uiLocale)
    document.documentElement.setAttribute("dir", isLangRTL(uiLocale) ? "rtl" : "ltr")
}

async function main() {
    const baseUrl = 'https://play.dhis2.org/dev'
    try {
        const dhis2 = new DHIS2API(DHIS2APIConfig)
        const api = new D2Api({ baseUrl: baseUrl, auth: { username: 'admin', password: 'district'} })

        const userSettings = await api.get("/userSettings").getData()
        configI18n(userSettings)
        console.log(userSettings)
        console.log(DHIS2API)
        ReactDOM.render(
            <Provider config={{ baseUrl, apiVersion: "30" }}>
                {/*<App />*/}
                <p>is this working?</p>
            </Provider>,
            document.getElementById("root")
        )
    } catch (err) {
        console.error(err);
        const message = err.toString().match("Unable to get schemas") ? (
            <h3 style={{ margin: 20 }}>
                <a rel="noopener noreferrer" target="_blank" href={baseUrl}>
                    Login
                </a>
                {` ${baseUrl}`}
            </h3>
        ) : (
            err.toString()
        )
        ReactDOM.render(<div>{message}</div>, document.getElementById("root"))
    }
}

main()
