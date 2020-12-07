import React, { useState } from 'react'
import { AlertBar, Button, Card, Radio } from '@dhis2/ui-core'
import { FileInputField } from '@dhis2/ui-widgets'
import i18n from '@dhis2/d2-i18n' //do translations!
import '../styles/FileForm.css'


const FileForm = () => {
    const [file, setFile] = useState(null)
    const [config, setConfig] = useState({})
    const [isFileOk, setFileOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)

    function onFormSubmit() {
        if (file != null && file.type==='application/json') {          
            fileUpload(file)
        } else {
            setFileOk(false)
        }
    }
    
    function onFileChange(payload) {
        setFileOk(true)
        setUploaded(false)
        setFile(payload.files[0])
        console.log('file', file)

    }

    function fileUpload(file) {
        const fileReader = new FileReader()
        fileReader.readAsText(file, "UTF-8")
        fileReader.onload = function() {
            console.log("DATA:", fileReader.result)
            setConfig(JSON.parse(fileReader.result))
        }
        setUploaded(true)
    }

    return (
        <div className="container"> 
            <div className="card"> 
                <Card dataTest="dhis2-uicore-card">
                    <h3>Import credentials</h3>
                    <div className="content">
                        <FileInputField 
                            className="input"
                            accept="application/json" 
                            buttonLabel={ file!=null ? file.name : "Choose a file to upload" }
                            dataTest="dhis2-uiwidgets-fileinputfield"
                            name="upload"
                            onChange={ onFileChange }
                            placeholder=""
                            required
                        />
                        <p>Format</p>
                        <Radio 
                            dataTest="dhis2-uicore-radio"
                            label="JSON"
                            checked
                            disabled
                        />
                    </div>
                    <div className="import">
                        <Button
                            dataTest="dhis2-uicore-button"
                            name="button"
                            onClick={ onFormSubmit }
                            type="button"
                        >
                            Import
                        </Button>
                    </div>
                </Card>
            </div>
            <div className="alert-bars">
            { !isFileOk && 
                <AlertBar 
                    dataTest="dhis2-uicore-alertbar" 
                    duration={8000} 
                    icon permanent warning
                >
                    Error uploading file
                </AlertBar> }
            { isUploaded && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar" 
                        duration={8000} 
                        icon permanent success
                    >
                        File uploaded correctly
                    </AlertBar>
                </div> 
            }
            </div>
            
        </div>
    )
    
}

export default FileForm