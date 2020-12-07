import React, { useState } from 'react'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import i18n from '@dhis2/d2-i18n' //do translations!
import '../styles/Form.css'
import config from '../utils/config.base'


const Form = () => {
    const [formData, setFormData] = useState(config)
    const [isOk, setOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)
    
    function onFormSubmit() {
        console.log(formData)
    }

    function handleOnChange(event) {
        const { value, name } = event.target
        if (name.includes('.')) {
            const query = name.split('.')
            setFormData(prevData => ({ 
                ...prevData,
                [query[0]] : {
                    ...prevData[query[0]],
                    [query[1]]: value
                } 
            }))
        } else {
            setFormData(prevData => ({ 
                ...prevData,
                [name] : value 
            }))
        }        
    }

    //to handle Dhis2 Data Elements Checks
    function handleOnChangeArray(event) {
        const { value, name } = event.target
        const query = name.split('.')
        const pos = parseInt(query[2])
        const oldData = formData[query[0]]
        oldData[query[1]][0][pos] = value
        setFormData(prevData => ({ 
            ...prevData,
            [query[0]] : oldData 
        }))
    }

    //to handle integer inputs
    function handleOnChangeInteger(event) {
        const { value, name } = event.target
        setFormData(prevData => ({ 
            ...prevData,
            [name] : parseInt(value, 10) 
        }))
        console.log(formData)
    }

    

    return (
        <div className="container"> 
            <div className="card"> 
                <Card dataTest="dhis2-uicore-card">
                    <h3>Base configuration settings</h3>
                    <div className="content">
                        <p>Disease</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="disease" 
                            value={ formData["disease"] }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 cases program</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2CasesProgram" 
                            value={ formData["dhis2CasesProgram"] }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Cases Program</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2ContactsProgram" 
                            value={ formData["dhis2ContactsProgram"] }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Contacts Relationship</p>
                        <input 
                            className="text-input" 
                            size="30"
                            name="dhis2ContactsRelationship" 
                            value={ formData["dhis2ContactsRelationship"] }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Key Program Stages</p>
                        <span className="subtitle">Lab Request:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.labRequest" 
                            value={ formData["dhis2KeyProgramStages"].labRequest }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Lab Results:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.labResults" 
                            value={ formData["dhis2KeyProgramStages"].labResults }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Symptoms:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.symptoms" 
                            value={ formData["dhis2KeyProgramStages"].symptoms }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Key Attributes</p>
                        <span className="subtitle">First Name:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.firstName" 
                            value={ formData["dhis2KeyAttributes"].firstName }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Surname:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.surname" 
                            value={ formData["dhis2KeyAttributes"].surname }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Sex:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.sex" 
                            value={ formData["dhis2KeyAttributes"].sex }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Date of birth:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.dateOfBirth" 
                            value={ formData["dhis2KeyAttributes"].dateOfBirth }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Home Address:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.address" 
                            value={ formData["dhis2KeyAttributes"].address }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Data Elements Checks</p>
                        <span className="subtitle">Confirmed test:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.0" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][0] }
                            onChange={ handleOnChangeArray }
                        />
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.1" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][1] }
                            onChange={ handleOnChangeArray }
                        />
                        <p>Outbreak Creation Mode</p>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakCreationMode"
                            value={ formData["outbreakCreationMode"] }
                            onChange={ handleOnChangeInteger }
                        >
                            <FormControlLabel value={ 0 } control={ <Radio className="radio"/> } label="Group" />
                            <FormControlLabel value={ 1 } control={ <Radio className="radio"/> } label="Expand" />
                        </RadioGroup>
                        <p>Dhis2 Key Program Stages</p>
                        <span className="subtitle">Lab Request:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.labRequest" 
                            value={ formData["dhis2KeyProgramStages"].labRequest }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Lab Results:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.labResults" 
                            value={ formData["dhis2KeyProgramStages"].labResults }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Symptoms:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyProgramStages.symptoms" 
                            value={ formData["dhis2KeyProgramStages"].symptoms }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Key Attributes</p>
                        <span className="subtitle">First Name:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.firstName" 
                            value={ formData["dhis2KeyAttributes"].firstName }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Surname:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.surname" 
                            value={ formData["dhis2KeyAttributes"].surname }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Sex:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.sex" 
                            value={ formData["dhis2KeyAttributes"].sex }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Date of birth:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.dateOfBirth" 
                            value={ formData["dhis2KeyAttributes"].dateOfBirth }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Home Address:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2KeyAttributes.address" 
                            value={ formData["dhis2KeyAttributes"].address }
                            onChange={ handleOnChange }
                        />
                        <p>Dhis2 Data Elements Checks</p>
                        <span className="subtitle">Confirmed test:</span>
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.0" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][0] }
                            onChange={ handleOnChangeArray }
                        />
                        <input 
                            className="text-input-group" 
                            size="15"
                            name="dhis2DataElementsChecks.confirmedTest.1" 
                            value={ formData["dhis2DataElementsChecks"].confirmedTest[0][1] }
                            onChange={ handleOnChangeArray }
                        />
                        <p>Outbreak Creation Mode</p>
                        <RadioGroup 
                            className="radio-group"
                            name="outbreakCreationMode"
                            value={ formData["outbreakCreationMode"] }
                            onChange={ handleOnChangeInteger }
                        >
                            <FormControlLabel value={ 0 } control={ <Radio className="radio"/> } label="Group" />
                            <FormControlLabel value={ 1 } control={ <Radio className="radio"/> } label="Expand" />
                        </RadioGroup>
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

export default Form