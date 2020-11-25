import { MuiThemeProvider } from "@material-ui/core/styles";
import { LoadingProvider, SnackbarProvider } from "d2-ui-components";
import _ from "lodash";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";
import axios from 'axios'
import React, { Component, useEffect, useState } from 'react'
import Actions from "./Actions";

import i18n from '@dhis2/d2-i18n'

function onUpload() {
    const importedFile = document.getElementById("import-file")
}

function onFileChange(event) {
    console.log("onFileChange", JSON.parse(event.target.files[0]))
}

function placeholder() {
    return i18n.t("No file uploaded yet")
}


class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            config: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onFileChange = this.onFileChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this) //this should call dhis2 and godata wrappers
    }

    onFormSubmit(event) {
        event.preventDefault()
        this.fileUpload()
    }

    onFileChange(event) {
        this.setState({ config: event.target.files[0] })
    }

    fileUpload(file) {
        const formData = new FormData()
        formData.append('config', file)
        console.log('formdata', formData)
        axios.post('/config', formData, { headers: { 'Accept': 'application/json'} })
    }
    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                    <LoadingProvider>
                        <SnackbarProvider>
                            <div>  
                                <form>
                                    <input type="file" accept="application/JSON" name="import-file" onClick={ onFileChange } required/>
                                    <input type="submit" onClick={ onUpload }/>
                                </form>
                                <Actions />
                            </div>
                        </SnackbarProvider>
                    </LoadingProvider>
                </OldMuiThemeProvider>
            </MuiThemeProvider>
        )
    }
}

export default Form