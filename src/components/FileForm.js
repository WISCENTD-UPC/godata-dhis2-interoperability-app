import React, { useState, useEffect } from 'react'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import i18n from '@dhis2/d2-i18n' //do translations!
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import _ from 'lodash'
import '../styles/FileForm.css'
import { config } from 'dhis2-godata-interoperability'
import { getBaseUrl } from '../index'


const FileForm = () => {
    const [formData, setFormData] = useState({
        DHIS2APIConfig: config.DHIS2APIConfig,
        GoDataAPIConfig: config.GoDataAPIConfig
    })
    const [isOk, setOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)
    const [wrong, setWrong] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)

    const { d2 } = useD2()

    useEffect(() => {
        async function initInstances() {
            const userNamespace = await d2.currentUser.dataStore.get("dhis-godata-interoperability")
            const credConf = await userNamespace.get("cred-config")
            const password = await userNamespace.get("password")
            credConf.GoDataAPIConfig.credentials.password = password.password
            if (credConf != null) {
                setFormData(credConf)
            }  
        }
        if (d2) {
            initInstances()
        }
    }, [d2])
    
    function onFormSubmit() {

        async function submit(data) {
            const conf = _.cloneDeep(data)
            conf.DHIS2APIConfig.baseURL = await getBaseUrl() + '/api'

            const password = conf.GoDataAPIConfig.credentials.password
            conf.GoDataAPIConfig.credentials.password = null

            if(await d2.currentUser.dataStore.has("dhis-godata-interoperability")) {
                const namespace = await d2.currentUser.dataStore.get("dhis-godata-interoperability")
                await namespace.set("password", { 'password': password }, false, true)
                await namespace.set("cred-config", conf)
            } else {
                const namespace = await d2.currentUser.dataStore.create("dhis-godata-interoperability")
                await namespace.set("password", { 'password': password }, false, true)
                await namespace.set("cred-config", conf)
            }
        }

        if (isOk === true) {
            submit(formData)
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
                    <p className="p">GoData API Configuration</p>
                        <span className="subtitle">BaseURL:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="GoDataAPIConfig.baseURL" 
                            value={ formData["GoDataAPIConfig"].baseURL }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Email:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="GoDataAPIConfig.credentials.email" 
                            value={ formData["GoDataAPIConfig"].credentials.email }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Password:</span>
                        <input 
                            className="text-input" 
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