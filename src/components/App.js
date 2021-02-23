import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { LoadingProvider } from 'd2-ui-components'
import OldMuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiThemeLegacy from './themes/dhis2-legacy.theme'
import { muiTheme } from './themes/dhis2.theme'
import Main from './Main'

import '../locales/index.js' // Required to initialize translations
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'


const App = () => {
    return (
        <D2Shim>
            {() => (
                <MuiThemeProvider theme={ muiTheme }>
                    <OldMuiThemeProvider muiTheme={ muiThemeLegacy }>
                        <LoadingProvider>
                            <Main />
                        </LoadingProvider>
                    </OldMuiThemeProvider>
                </MuiThemeProvider>
            )}
        </D2Shim>
    )
}

export default App
