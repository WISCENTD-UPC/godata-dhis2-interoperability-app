import React, { useEffect, useState } from 'react'
import { getInstance } from 'd2'
import { Button, Card } from '@dhis2/ui-core'
import { Radio, RadioGroup, FormControlLabel, Stepper, Step, StepLabel, StepContent } from '@material-ui/core'
import StorageIcon from '@material-ui/icons/Storage'
import DoneIcon from '@material-ui/icons/Done'
import { mergeAll } from 'ramda'
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
    const [fullActiveStep, setFullActiveStep] = useState(0)
    const fullTransferSteps = getFullSteps()
    const [activeStep, setActiveStep] = useState(0)
    const transferSteps = getSteps()

    const [fullSkipped, setFullSkipped] = useState(new Set())
    const [skipped, setSkipped] = useState(new Set())
    const [fullCompleted, setFullCompleted] = useState(new Set())
    const [completed, setCompleted] = useState(new Set())

    const [done, setDone] = useState(false)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        async function initInstances() {
            const d2 = await getInstance()
            const namespace = await d2.dataStore.get("interoperability")
            const baseConf = await namespace.get("base-config")
            const credConf = await namespace.get("cred-config")

            const conf = mergeAll([baseConf, credConf])
            setConfig(conf)
            setDhis2(new DHIS2API(conf.DHIS2APIConfig))
            setGoData(new GoDataAPI(conf.GoDataAPIConfig))
            
        }
        initInstances()
    }, [])

    const logAction = (message) => setMessages(prevArray => [...prevArray, { text: message, done: false }])
    const logDone = () => setMessages(prevArray => {
        const newArray = [...prevArray]
        newArray[newArray.length - 1].done = true
        return newArray
    })

    const handleFullSkip = () => {
        setFullActiveStep(prev => prev + 1)
        setFullSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values())
            newSkipped.add(fullActiveStep)
            if (newSkipped.size + fullCompleted.size === fullTransferSteps.length) { setDone(true) }
            return newSkipped
        })
        
    }

    const handleSkip = () => {
        setActiveStep(prev => prev + 1)
        setSkipped(prevSkipped => {
            const newSkipped = new Set(prevSkipped.values())
            newSkipped.add(activeStep)
            if (newSkipped.size + completed.size === transferSteps.length) { setDone(true) }
            return newSkipped
        })
    }

    const isFullStepSkipped = (step) => {
        return fullSkipped.has(step)
    }

    const isStepSkipped = (step) => {
        return skipped.has(step)
    } 
    
    const handleFullNext = () => {
        async function action() {
            switch(fullActiveStep) {
                case 0: 
                    await copyOrganisationUnits(dhis2, godata, config, { logAction, logDone })()
                    break
                case 1: 
                    await fullTransfer(dhis2, godata, config, { logAction, logDone })()
                    setDone(true)
                    break
                default: break
            }
        }
        setMessages([])
        action()
        setFullActiveStep(prev => prev + 1)
        setFullCompleted(prev => {
            const newCompleted = new Set(prev.values())
            newCompleted.add(fullActiveStep)
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
                                control={ <Radio disabled={ activeStep!==0 } className="radio"/> } 
                                label="Full transfer" 
                            />
                            <FormControlLabel 
                                value={ false } 
                                control={ <Radio disabled={ fullActiveStep!==0 } className="radio"/> } 
                                label="Step-by-step transfer" 
                            />
                        </RadioGroup>
                        { full &&
                            <Stepper activeStep={ fullActiveStep } orientation="vertical">
                            { fullTransferSteps.map((label, index) => {
                                const stepProps = {}
                                if (isFullStepSkipped(index)) {
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
                                                    disabled={ activeStep!==0 }
                                                    onClick={ handleFullNext }
                                                >
                                                    Complete
                                                </Button>
                                                <Button
                                                    dataTest="dhis2-uicore-button"
                                                    name="button"
                                                    type="button"
                                                    disabled={ activeStep!==0 }
                                                    onClick={ handleFullSkip }
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