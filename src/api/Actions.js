import React, { useEffect, useState } from 'react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { Button, Card } from '@dhis2/ui-core'
import { Radio, RadioGroup, FormControlLabel, Stepper, Step, StepLabel, StepContent } from '@material-ui/core'
import StorageIcon from '@material-ui/icons/Storage'
import DoneIcon from '@material-ui/icons/Done'
import { mergeAll } from 'ramda'
import _ from 'lodash'
import DHIS2API from 'dhis2-api-wrapper'
import GoDataAPI from 'godata-api-wrapper'
import { copyOrganisationUnits, fullTransfer, copyCases, createOutbreaks, copyContacts, copyMetadata } from 'dhis2-godata-interoperability'
import '../styles/Actions.css'
import { getFullSteps, getFullStepContent, getSteps, getStepContent } from '../utils/labels'

const Actions = () => {
    const [config, setConfig] = useState({})
    const [dhis2, setDhis2] = useState(null)
    const [godata, setGoData] = useState(null)
    
    const [full, setFull] = useState(true)
    const fullTransferSteps = getFullSteps()
    const [activeStep, setActiveStep] = useState(0)
    const transferSteps = getSteps()

    const [skipped, setSkipped] = useState(new Set())
    const [completed, setCompleted] = useState(new Set())

    const [done, setDone] = useState(false)
    const [messages, setMessages] = useState([])

    const { d2 } = useD2()

    useEffect(() => {
        async function initInstances() {
            const generalNamespace = await d2.dataStore.get("dhis-godata-interoperability")
            const userNamespace = await d2.currentUser.dataStore.get("dhis-godata-interoperability")
            const baseConf = await generalNamespace.get("base-config")
            const credConf = await userNamespace.get("cred-config")
            const password = await userNamespace.get("password")
            credConf.GoDataAPIConfig.credentials.password = password.password
            const conf = mergeAll([baseConf, credConf])
            setConfig(conf)
            setDhis2(new DHIS2API(conf.DHIS2APIConfig))
            setGoData(new GoDataAPI(conf.GoDataAPIConfig))
            
        }
        if (d2) {
            initInstances()
        }
    }, [d2])

    const logAction = (message) => setMessages(prevArray => [...prevArray, { text: message, done: false }])
    const logDone = () => setMessages(prevArray => {
        const newArray = [...prevArray]
        newArray[newArray.length - 1].done = true
        return newArray
    })

    const handleSkip = () => {
        setActiveStep(prev => prev + 1)
        setSkipped(prevSkipped => {
            const newSkipped = new Set(prevSkipped.values())
            const length = full ? fullTransferSteps.length : transferSteps.length 
            newSkipped.add(activeStep)
            if (newSkipped.size + completed.size === length) { setDone(true) }
            return newSkipped
        })
    }

    const isStepSkipped = (step) => {
        return skipped.has(step)
    } 
    
    const handleFullNext = () => {
        async function action() {
            switch(activeStep) {
                case 0: 
                    await copyOrganisationUnits(dhis2, godata, config, { logAction, logDone })()
                    break
                case 1: 
                    await fullTransfer(dhis2, godata, config, { logAction, logDone })()//TODO
                    setDone(true)
                    break
                default: break
            }
        }
        setMessages([])
        action()
        setActiveStep(prev => prev + 1)
        setCompleted(prev => {
            const newCompleted = new Set(prev.values())
            newCompleted.add(activeStep)
            return newCompleted
        })
    }
    const handleNext = () => {
        async function action() {
            switch(activeStep) {
                case 0: 
                    await copyOrganisationUnits(dhis2, godata, config, { logAction, logDone })()
                    break
                case 1: 
                    await copyMetadata(dhis2, godata, config, { logAction, logDone })()
                    break
                case 2: 
                    await godata.login()
                    await createOutbreaks(dhis2, godata, config, { logAction, logDone })()
                    break
                case 3: 
                    await godata.login()
                    await copyCases(dhis2, godata, config, { logAction, logDone })()
                    break
                case 4: 
                    await godata.login()
                    await copyContacts(dhis2, godata, config, { logAction, logDone })()
                    setDone(true)
                    break
                default: break
            }
        }
        setMessages([])
        action()
        setActiveStep(prev => prev + 1)
        setCompleted(prev => {
            const newCompleted = new Set(prev.values())
            newCompleted.add(activeStep)
            return newCompleted
        })
    }

    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <div className="title-icon">
                        <StorageIcon />
                        <h3>Export data and metadata</h3>
                    </div>
                    <div className="content">
                        <p className="p">Choose export sequence</p>
                        <RadioGroup 
                            className="radio-group"
                            name="fullTransfer"
                            value={ full }
                            onChange={ () => setFull(prev => !prev) }
                        >
                            <FormControlLabel 
                                value={ true } 
                                control={ <Radio disabled={ activeStep!==0 & !full } className="radio"/> } 
                                label="Full transfer" 
                            />
                            <FormControlLabel 
                                value={ false } 
                                control={ <Radio disabled={ activeStep!==0 & full } className="radio"/> } 
                                label="Step-by-step transfer" 
                            />
                        </RadioGroup>
                        { full &&
                            <Stepper activeStep={ activeStep } orientation="vertical">
                            { fullTransferSteps.map((label, index) => {
                                const stepProps = {}
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false
                                }
                                return (
                                    <Step key={ label }{...stepProps}>
                                        <StepLabel>{ label }</StepLabel>
                                        <StepContent>
                                            <div className="helper">{ getFullStepContent(index) }</div>
                                            <div className="import">
                                                <Button
                                                    dataTest="dhis2-uicore-button"
                                                    name="button"
                                                    type="button"
                                                    onClick={ handleFullNext }
                                                >
                                                    Complete
                                                </Button>
                                                <Button
                                                    dataTest="dhis2-uicore-button"
                                                    name="button"
                                                    type="button"
                                                    onClick={ handleSkip }
                                                >
                                                    Skip
                                                </Button>
                                            </div>
                                        </StepContent>
                                    </Step>
                                )
                            })}
                            </Stepper>
                        }
                        { !full &&
                            <Stepper activeStep={ activeStep } orientation="vertical">
                            { transferSteps.map((label, index) => {
                                const stepProps = {}
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false
                                }
                                return (
                                    <Step key={ label }{...stepProps} >
                                        <StepLabel>{ label }</StepLabel>
                                        <StepContent>
                                            <div className="helper">{ getStepContent(index) }</div>
                                            <div className="import">
                                                <Button
                                                    dataTest="dhis2-uicore-button"
                                                    name="button"
                                                    type="button"
                                                    onClick={ handleNext }
                                                >
                                                    Complete
                                                </Button>
                                                <Button
                                                    dataTest="dhis2-uicore-button"
                                                    name="button"
                                                    type="button"
                                                    onClick={ handleSkip }
                                                >
                                                    Skip
                                                </Button>
                                            </div>
                                        </StepContent>
                                    </Step>
                                )
                            })}    
                            </Stepper>
                        }
                    </div>                    
                </Card>
                <div>
                    { messages.map(message => (
                        <Card className="log">
                            <div className="title-icon" key={ message }>
                                <div className="logAction">{ message.text+"..." }</div>
                                { message.done && <DoneIcon /> }
                            </div>
                        </Card>
                    ))}
                
                </div>
                
                { done && 
                    <Card className="log">
                        <p className="title-icon">
                            <span className="p">All steps completed - you're finished</span>
                        </p>
                    </Card>
                }
            </div>
        </div>

    )
}

export default Actions