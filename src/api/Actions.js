import React, { useEffect, useState } from 'react'
import { getInstance } from 'd2'
import { Button, Card } from '@dhis2/ui-core'
import { Radio, RadioGroup, FormControlLabel, Stepper, Step, StepLabel, StepContent } from '@material-ui/core'
import StorageIcon from '@material-ui/icons/Storage'
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
    const [fullActiveStep, setFullActiveStep] = useState(0);
    const fullTransferSteps = getFullSteps();
    const [activeStep, setActiveStep] = useState(0);
    const transferSteps = getSteps();

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

    const logAction = (message) => setMessages(prevArray => [...prevArray, message])
    
    const handleFullNext = () => {
        async function action() {
            switch(fullActiveStep) {
                case 0: 
                    await copyOrganisationUnits(dhis2, godata, config, { logAction: logAction })()
                    break
                case 1: 
                    await fullTransfer(dhis2, godata, config, { logAction: logAction })()
                    setDone(true)
                    break
                default: break
            }
        }
        action()
        setFullActiveStep(prev => prev + 1)
    }
    const handleNext = () => {
        async function action() {
            switch(activeStep) {
                case 0: 
                    await copyOrganisationUnits(dhis2, godata, config, { logAction: logAction })()
                    break
                case 1: 
                    createOutbreaks(dhis2, godata, config, { logAction: logAction })()
                    break
                case 2: 
                    copyCases(dhis2, godata, config, { logAction: logAction })()
                    break
                case 3: 
                    copyContacts(dhis2, godata, config, { logAction: logAction })()
                    setDone(true)
                    break
                default: break
            }
        }
        action()
        setActiveStep(prev => prev + 1)
    }

    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <div className="title-icon">
                        <StorageIcon />
                        <h3>Base configuration settings</h3>
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
                            { fullTransferSteps.map((label, index) => (
                            <Step key={ label }>
                                <StepLabel className="subtitle">{ label }</StepLabel>
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
                                            { fullActiveStep === fullTransferSteps.length - 1 ? 'Finish' : 'Next' }
                                        </Button>
                                    </div>
                                </StepContent>
                            </Step>
                            ))}
                            </Stepper>
                        }
                        { !full &&
                            <Stepper activeStep={ activeStep } orientation="vertical">
                            { transferSteps.map((label, index) => (
                            <Step key={ label }>
                                <StepLabel className="subtitle">{ label }</StepLabel>
                                <StepContent>
                                    <div className="helper">{ getStepContent(index) }</div>
                                    <div className="import">
                                        <Button
                                            dataTest="dhis2-uicore-button"
                                            name="button"
                                            type="button"
                                            onClick={ handleNext }
                                        >
                                            { activeStep === transferSteps.length - 1 ? 'Finish' : 'Next' }
                                        </Button>
                                    </div>
                                </StepContent>
                            </Step>
                            ))}
                            </Stepper>
                        }
                        { fullActiveStep === fullTransferSteps.length && <p className="p">All steps completed - you're finished</p> }
                        { activeStep === transferSteps.length && <p className="p">All steps completed - you're finished</p> }
                    </div>                    
                </Card>
                { !done && 
                    <div>
                        { messages.map(message => (
                            <Card className="log">
                                <div className="logAction" key={ message }>{ message }</div>
                            </Card>
                        ))}
                    </div>
                }
            </div>
        </div>

    )
}

export default Actions