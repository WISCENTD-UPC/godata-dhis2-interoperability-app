import React, { useState } from 'react'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import { FileInputField } from '@dhis2/ui-widgets'
import i18n from '@dhis2/d2-i18n' //do translations!
import Actions from "./Actions";

const FileForm = () => {
    const [file, setFile] = useState(null)
    const [config, setConfig] = useState({})
    const [isFileOk, setFileOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)

    function onFormSubmit() {
        setFileOk(true)
        if (file != null && file.type=='application/json') {          
            fileUpload(file)
        } else {
            setFileOk(false)
        }
    }
    
    function onFileChange(payload, event) {
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
        <div> 
            <div
                style={ {
                    position: fixed,
                    width: 60,
                    zIndex: 700,
                    alignItems: center,
                } }> 
                <MyCard dataTest="dhis2-uicore-card" className="file-form">
                    <FileInputField 
                        accept="application/json" 
                        buttonLabel="Upload file" 
                        dataTest="dhis2-uiwidgets-fileinputfield"
                        name="upload"
                        onChange={ onFileChange }
                        placeholder={file!=null ? file.name : "No file uploaded yet"}
                        required
                    />
                    <Button
                        dataTest="dhis2-uicore-button"
                        name="button"
                        onClick={ onFormSubmit }
                        type="button"
                    >
                        Submit
                    </Button>
                </MyCard>
            </div>
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
                    <Actions config={ config }/>
                </div> 
            }
        </div>
    )
    
}

export default FileForm