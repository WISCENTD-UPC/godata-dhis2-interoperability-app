import React, { useState } from 'react'
import { getInstance } from 'd2'
import { Card } from '@dhis2/ui-core'
import * as R from 'ramda'
import DHIS2API from 'dhis2-api-wrapper'
import GoDataAPI from 'godata-api-wrapper'
//import { copyOrganisationUnits } from 'dhis2-godata-interoperability'

const Actions = () => {
    const [credConfig, setCredConfig] = useState({})
    const [baseConfig, setBaseConfig] = useState({})
    const [config, setMainConfig] = useState({})
    const [dhis2, setDhis2] = useState(null)
    const [godata, setGoData] = useState(null)

    function init() {
        getInstance()
            .then(d2 => {
                d2.dataStore.get("interoperability")
                    .then(namespace => {        
                        namespace.get("formData")
                        .then(value => setBaseConfig(value))

                        namespace.get("fileFormData")
                        .then(value => setCredConfig(value))
                    })
            })
        setMainConfig(R.mergeAll(credConfig, baseConfig))
        setDhis2(new DHIS2API(config.DHIS2APIConfig))
        setGoData(new GoDataAPI(config.GoDataAPIConfig))
    }
    /*
    async function copyOrgUnits() {
        const res = await copyOrganisationUnits(dhis2, godata, config)("orgUnits.json")
        console.log(res)
    }
    /*
    async function getOutbreaks() {
        const res = await int.createOutbreaks(dhis2, godata, config)
        console.log(res)
    }

    async function getCases() {
        const res = await int.copyCases(dhis2, godata, config)
        console.log(res)
    }
    //copyOrgUnits() 
    async function getOrgUnits(dhis2) {
        return await dhis2.getOrganisationUnitsFromParent(config.rootID)
    } 
    const orgUnits = getOrgUnits(dhis2)
    //const res = orgUnits.map(orgUnit => <div key={ orgUnit.id }>{ orgUnit.name }</div>) //this is to be sure it works
    
    
    async function getOrgUnits() {
        console.log("orgUnits", await dhis2.getOrganisationUnitsFromParent(config.rootID))
    }
    getOrgUnits()*/
    /*
    async function getOutbreaks() {
        console.log("outbreaks", await godata.getOutbreaks())
    }
    getOutbreaks()
    */
    copyOrgUnits()
    
    
    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <button onClick={ init }>Click me!</button>
                </Card>
            </div>
        </div>

    )
}

export default Actions