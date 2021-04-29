import React, { useState, useEffect } from 'react'
import * as R from 'ramda'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TuneIcon from '@material-ui/icons/Tune'
import i18n from '@dhis2/d2-i18n' //do translations!
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import '../styles/Form.css'
import { config } from 'dhis2-godata-interoperability'

const Form = () => {
    const [formData, setFormData] = useState(R.pipe(
        R.dissoc('GoDataAPIConfig'), 
        R.dissoc('DHIS2APIConfig')
    )(config))
    const [isUploaded, setUploaded] = useState(false)
    const showOutbreakGroupingLevel = formData.outbreakCreationMode===0

    const { d2 } = useD2()

    useEffect(() => {
        async function initInstances() {
            const generalNamespace = await d2.dataStore.get("dhis-godata-interoperability")
            const baseConf = await generalNamespace.get("base-config")
            if (baseConf != null) {
                setFormData(baseConf)
            }  
        }
        if (d2) {
            initInstances()
        }
    }, [d2])
    
    function onFormSubmit() {
        async function submit() {
            if(await d2.dataStore.has("dhis-godata-interoperability")) {
                const namespace = await d2.dataStore.get("dhis-godata-interoperability")
                await namespace.set("base-config", formData)
            } else {
                const namespace = await d2.dataStore.create("dhis-godata-interoperability")
                await namespace.set("base-config", formData)
            }
        }
        submit()
        setUploaded(true)
    }

    //to handle text inputs
    function handleOnChange(event) {
        const { value, name } = event.target
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

    //to handle Dhis2 Data Elements Checks
    function handleOnChangeArray(event) {
        const { value, name } = event.target
        const query = name.split('.')
        let oldData
        let pos
        if (query.length === 2) {
            oldData = [value]
        } else {
            pos = parseInt(query[2])
            oldData = formData[query[0]]
            oldData[query[1]][0][pos] = value
        }
        setFormData(prevData => ({ 
            ...prevData,
            [query[0]] : oldData 
        }))
    }

    //to handle integer inputs
    function handleOnChangeInteger(event) {
        const { value, name } = event.target
        const intValue = parseInt(value, 10) 
        if (name.includes('.')) {
            const query = name.split('.')
            setFormData(prevData => ({ 
                ...prevData,
                [query[0]] : {
                    ...prevData[query[0]],
                    [query[1]]: intValue
                } 
            }))
        } else {
            setFormData(prevData => ({ 
                ...prevData,
                [name] : intValue
            }))
        }
    }

    //to handle boolean inputs
    function handleOnChangeBool(event) {
        const { value, name } = event.target
        const boolValue = value === "true"
        if (name.includes('.')) {
            const query = name.split('.')
            setFormData(prevData => ({ 
                ...prevData,
                [query[0]] : {
                    ...prevData[query[0]],
                    [query[1]]: boolValue
                } 
            }))
        } else {
            setFormData(prevData => ({ 
                ...prevData,
                [name] : boolValue
            }))
        }
    }

    const checkInt = (value) => {
        return isNaN(value) ? 0 : value
    }


    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <div className="title-icon">
                        <TuneIcon />
                        <h3>Base configuration settings</h3>
                    </div>
                    <div className="content">
                        <p className="p">Disease</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="disease" 
                            value={ formData["disease"] }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 cases program</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2CasesProgram" 
                            value={ formData["dhis2CasesProgram"] }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Contacts Program</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2ContactsProgram" 
                            value={ formData["dhis2ContactsProgram"] }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Contacts Relationship</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2ContactsRelationship" 
                            value={ formData["dhis2ContactsRelationship"] }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Key Program Stages</p>
                        <span className="subtitle">Clinical Examination:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2KeyProgramStages.clinicalExamination" 
                            value={ formData["dhis2KeyProgramStages"].clinicalExamination }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Lab Request:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2KeyProgramStages.labRequest" 
                            value={ formData["dhis2KeyProgramStages"].labRequest }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Lab Results:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2KeyProgramStages.labResults" 
                            value={ formData["dhis2KeyProgramStages"].labResults }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Health Outcome:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2KeyProgramStages.healthOutcome" 
                            value={ formData["dhis2KeyProgramStages"].healthOutcome }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Symptoms:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2KeyProgramStages.symptoms" 
                            value={ formData["dhis2KeyProgramStages"].symptoms }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Key Attributes</p>
                        <span className="subtitle">CaseID:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.caseID" 
                            value={ formData["dhis2KeyAttributes"].caseID }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">First Name:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.firstName" 
                            value={ formData["dhis2KeyAttributes"].firstName }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Surname:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.surname" 
                            value={ formData["dhis2KeyAttributes"].surname }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Sex:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.sex" 
                            value={ formData["dhis2KeyAttributes"].sex }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Date of birth:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.dateOfBirth" 
                            value={ formData["dhis2KeyAttributes"].dateOfBirth }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Age:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.age" 
                            value={ formData["dhis2KeyAttributes"].age }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Address:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.address" 
                            value={ formData["dhis2KeyAttributes"].address }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Passport:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyAttributes.passport" 
                            value={ formData["dhis2KeyAttributes"].passport }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Key Data Elements</p>
                        <span className="subtitle">Pregnancy:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyDataElements.pregnancy" 
                            value={ formData["dhis2KeyDataElements"].pregnancy }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Date of onset:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyDataElements.dateOfOnset" 
                            value={ formData["dhis2KeyDataElements"].dateOfOnset }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Health Outcome:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyDataElements.healthOutcome" 
                            value={ formData["dhis2KeyDataElements"].healthOutcome }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Type of Vaccine:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyDataElements.typeOfVaccine" 
                            value={ formData["dhis2KeyDataElements"].typeOfVaccine }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Lab Test Result:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2KeyDataElements.typeOfVaccine" 
                            value={ formData["dhis2KeyDataElements"].labTestResult }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Dhis2 Data Elements Checks</p>
                        <span className="subtitle">Confirmed test:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.0" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][0] }
                            onChange={ handleOnChangeArray }
                        />
                        <input 
                            className="text-input" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.1" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][1] }
                            onChange={ handleOnChangeArray }
                        />
                        <p className="p">Outbreak Creation Mode</p>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakCreationMode"
                            value={ formData["outbreakCreationMode"] }
                            onChange={ handleOnChangeInteger }
                        >
                            <FormControlLabel value={ 0 } control={ <Radio className="radio"/> } label="Group" />
                            <FormControlLabel value={ 1 } control={ <Radio className="radio"/> } label="Expand" />
                        </RadioGroup>
                        <div className="helper-text">GROUP mode creates one outbreak for each group of organisation units under a certain administrative level</div> 
                        <div className="helper-text">EXPAND mode creates one outbreak for each organisation unit with tracked entities</div>
                        { showOutbreakGroupingLevel &&
                        <div>
                            <p className="p">Outbreak Creation Grouping Level</p>
                            <span className="subtitle">Grouping level:</span>
                            <input 
                                className="text-input" 
                                size="1"
                                type="number"
                                min="0"
                                name="outbreakConfig.outbreakCreationGroupingLevel" 
                                value={ checkInt(formData["outbreakConfig"].outbreakCreationGroupingLevel) }
                                onChange={ handleOnChangeInteger }
                            
                            />
                        </div> }
                        <p className="p">Outbreak Configuration</p>
                        <span className="subtitle">Period follow-up:</span>
                        <input 
                            className="text-input"
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.periodOfFollowup" 
                            value={ checkInt(formData["outbreakConfig"].periodOfFollowup) }
                            onChange={ handleOnChangeInteger }
                        
                        />
                        <br />
                        <span className="subtitle">Frequency of follow-up per day:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.frequencyOfFollowUpPerDay" 
                            value={ checkInt(formData["outbreakConfig"].frequencyOfFollowUpPerDay) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Number of days among known contacts:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.noDaysAmongContacts" 
                            value={ checkInt(formData["outbreakConfig"].noDaysAmongContacts) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Number of days in known transmission chains:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.noDaysInChains" 
                            value={ checkInt(formData["outbreakConfig"].noDaysInChains) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Number of days not seen:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.noDaysNotSeen" 
                            value={ checkInt(formData["outbreakConfig"].noDaysNotSeen) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Number less than X contacts:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.noLessContacts" 
                            value={ checkInt(formData["outbreakConfig"].noLessContacts) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">No days new contacts:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.noDaysNewContacts" 
                            value={ checkInt(formData["outbreakConfig"].noDaysNewContacts) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Reporting Geoprahical Level Id:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.reportingGeographicalLevelId" 
                            value={ checkInt(formData["outbreakConfig"].reportingGeographicalLevelId) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Case Id Mask:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="outbreakConfig.caseIdMask" 
                            value={ formData["outbreakConfig"].caseIdMask }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Contact Id Mask:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="outbreakConfig.contactIdMask" 
                            value={ formData["outbreakConfig"].contactIdMask }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Long periods between case onset:</span>
                        <input 
                            className="text-input" 
                            size="1"
                            type="number"
                            min="0"
                            name="outbreakConfig.longPeriodsBetweenCaseOnset" 
                            value={ checkInt(formData["outbreakConfig"].longPeriodsBetweenCaseOnset) }
                            onChange={ handleOnChangeInteger }
                        />
                        <br />
                        <span className="subtitle">Active contact lab results:</span>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakConfig.isContactLabResultsActive"
                            value={ formData["outbreakConfig"].isContactLabResultsActive }
                            onChange={ handleOnChangeBool }
                        >
                            <FormControlLabel value={ true } control={ <Radio className="radio"/> } label="Yes" />
                            <FormControlLabel value={ false } control={ <Radio className="radio"/> } label="No" />
                        </RadioGroup>
                        <br />
                        <span className="subtitle">Required date of onset:</span>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakConfig.isDateOfOnsetRequired"
                            value={ formData["outbreakConfig"].isDateOfOnsetRequired }
                            onChange={ handleOnChangeBool }
                        >
                            <FormControlLabel value={ true } control={ <Radio className="radio"/> } label="Yes" />
                            <FormControlLabel value={ false } control={ <Radio className="radio"/> } label="No" />
                        </RadioGroup>
                        <br />
                        <span className="subtitle">Overwrite existing when generating follow-ups:</span>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakConfig.generateFollowUpsOverwriteExisting"
                            value={ formData["outbreakConfig"].generateFollowUpsOverwriteExisting }
                            onChange={ handleOnChangeBool }
                        >
                            <FormControlLabel value={ true } control={ <Radio className="radio"/> } label="Yes" />
                            <FormControlLabel value={ false } control={ <Radio className="radio"/> } label="No" />
                        </RadioGroup>
                        <br />
                        <span className="subtitle">Keep team assignment when generating follow-ups:</span>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakConfig.generateFollowUpsKeepTeamAssignment"
                            value={ formData["outbreakConfig"].generateFollowUpsKeepTeamAssignment }
                            onChange={ handleOnChangeBool }
                        >
                            <FormControlLabel value={ true } control={ <Radio className="radio"/> } label="Yes" />
                            <FormControlLabel value={ false } control={ <Radio className="radio"/> } label="No" />
                        </RadioGroup>
                        <p className="p">Metadata - Option sets</p>
                        <span className="subtitle">Vaccine:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="metadata.optionSets.Vaccine" 
                            value={ formData["metadata"].optionSets.Vaccine }
                            onChange={ handleOnChange }
                        />
                        <p className="p">Countries</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="countries.0" 
                            value={ formData["countries"][0] }
                            onChange={ handleOnChangeArray }
                        />
                        <p className="p">Root ID</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="rootID" 
                            value={ formData["rootID"] }
                            onChange={ handleOnChange }
                        />
                        <div className="helper-text">The rootID value has to be the ID of the tree's root orgUnit that you want to export to Go.Data</div>
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
            { isUploaded && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar" 
                        duration={8000} 
                        icon permanent success
                    >
                        Settings saved correctly
                    </AlertBar>
                </div> 
            }
            </div>
            
        </div>
    )
    
}

export default Form