import React, { useState } from 'react'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import i18n from '@dhis2/d2-i18n' //do translations!
import { getInstance } from 'd2'
import '../styles/FileForm.css'
import config from '../utils/config'


const FileForm = () => {
    const [formData, setFormData] = useState(config)
    const [isOk, setOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)
    const [wrong, setWrong] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    
    function onFormSubmit() {
        if (isOk === true) {
            getInstance()
            .then(d2 => {
                d2.dataStore.get("interoperability")
                    .then(namespace => namespace.set("config", formData))
            })
            setUploaded(true)
        } else {
            setWrong(true)
        }
    }

    //to handle text inputs
    function handleOnChange(event) {
        setOk(true)
        const { value, name } = event.target
        if (value === '') {
            setOk(false)
        }
        const query = name.split('.')
        switch(query.length) {
            case 1: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [name] : value 
                }))
                break
            case 2: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [query[0]] : {
                        ...prevData[query[0]],
                        [query[1]]: value
                    } 
                }))
                break
            case 3: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [query[0]] : {
                        ...prevData[query[0]],
                        [query[1]] : {
                            ...prevData[query[0]][query[1]],
                            [query[2]]: value
                        }
                    } 
                }))
                break
            default: break       
        }     
    }

    const handleClickShowPassword1 = () => {
        setShow1((prevState) => !prevState)
    }
    const handleClickShowPassword2 = () => {
        setShow2((prevState) => !prevState)
    }
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    
    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <div className="title-icon">
                        <VpnKeyIcon />
                        <h3>Import credentials</h3>
                    </div>
                    <div className="content">
                    <p>GoData API Configuration</p>
                        <span className="subtitle">BaseURL:</span>
                        <input 
                            className="text-input-group" 
                            size="30"
                            name="GoDataAPIConfig.baseURL" 
                            value={ formData["GoDataAPIConfig"].baseURL }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Email:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="GoDataAPIConfig.credentials.email" 
                            value={ formData["GoDataAPIConfig"].credentials.email }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Password:</span>
                        <input 
                            className="text-input-group" 
                            type={ show1 ? "text" : "password" }
                            size="15"
                            name="GoDataAPIConfig.credentials.password" 
                            value={ formData["GoDataAPIConfig"].credentials.password }
                            onChange={ handleOnChange }
                        />
                        <IconButton
                            className="icon-button"
                            aria-label="toggle password visibility"
                            onClick={ handleClickShowPassword1 }
                            onMouseDown={ handleMouseDownPassword }
                        >
                            { show1 ? <Visibility /> : <VisibilityOff /> }
                        </IconButton>
                        <p>Dhis2 API Configuration</p>
                        <span className="subtitle">BaseURL:</span>
                        <input 
                            className="text-input-group" 
                            size="30"
                            name="DHIS2APIConfig.baseURL" 
                            value={ formData["DHIS2APIConfig"].baseURL }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">User:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="DHIS2APIConfig.credentials.user" 
                            value={ formData["DHIS2APIConfig"].credentials.user }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Password:</span>
                        <input 
                            className="text-input-group" 
                            type={ show2 ? "text" : "password" }
                            size="15"
                            name="DHIS2APIConfig.credentials.password" 
                            value={ formData["DHIS2APIConfig"].credentials.password }
                            onChange={ handleOnChange }
                        />
                        <IconButton
                            className="icon-button"
                            aria-label="toggle password visibility"
                            onClick={ handleClickShowPassword2 }
                            onMouseDown={ handleMouseDownPassword }
                        >
                            { show2 ? <Visibility /> : <VisibilityOff /> }
                        </IconButton>
                        <p>Countries</p>
                        <input 
                            className="text-input-group" 
                            size="30"
                            name="countries" 
                            value={ formData["countries"][0] }
                            onChange={ handleOnChange }
                        />
                        <p>Root ID</p>
                        <input 
                            className="text-input-group" 
                            size="30"
                            name="rootID" 
                            value={ formData["rootID"] }
                            onChange={ handleOnChange }
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
            { !isOk && 
                <AlertBar 
                    dataTest="dhis2-uicore-alertbar"
                    icon permanent warning
                >
                    Some fields are in blank
                </AlertBar> }
            { isUploaded && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar"
                        icon permanent success
                    >
                        Credentials saved correctly
                    </AlertBar>
                </div> 
            }
            { wrong && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar" 
                        icon permanent critical
                    >
                        Some fields are in blank
                    </AlertBar>
                </div> 
            }
            </div>
            
        </div>
    )
    
}

export default FileForm