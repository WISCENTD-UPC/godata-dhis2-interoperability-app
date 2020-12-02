import React from 'react'
import { MuiThemeProvider } from "@material-ui/core/styles"
import { LoadingProvider, SnackbarProvider } from "d2-ui-components"
import _ from "lodash"
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import FileForm from './components/FileForm'
import muiThemeLegacy from "./components/themes/dhis2-legacy.theme"
import { muiTheme } from "./components/themes/dhis2.theme"
import Header from "./components/Header"
import { DataQuery } from '@dhis2/app-runtime'

const baseUrl = process.env.REACT_APP_DHIS2_BASE_URL
const appName = process.env.REACT_APP_DHIS2_APP_NAME
const apiVersion = parseInt(process.env.REACT_APP_DHIS2_API_VERSION) 

const query = {
    me: {
        resource: 'me'
    }
}

const App = () => (
   
    <MuiThemeProvider theme={ muiTheme }>
        <OldMuiThemeProvider muiTheme={ muiThemeLegacy }>
            <LoadingProvider>
                <Header baseUrl={ baseUrl } appName={ appName } apiVersion={ apiVersion } />
                <FileForm /> 
                <DataQuery query={query}>
                    {({error, loading, data}) => {
                        if (error) return <span>ERROR</span>
                        if (loading) return <span>LOADING...</span>
                        return (
                            <h1>{data.me.name}</h1>
                        )
                    }}
                    
                </DataQuery>  
            </LoadingProvider>
        </OldMuiThemeProvider>
    </MuiThemeProvider>
)

export default App
