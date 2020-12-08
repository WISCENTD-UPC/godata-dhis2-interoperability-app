import React, { useState } from 'react'
import DHIS2API from 'dhis2-api-wrapper'
import GoDataAPI from 'godata-api-wrapper'
//import * as int from 'dhis2-godata-interoperability'

const Actions = () => {
    const config = {
        GoDataAPIConfig: {
            baseURL: 'http://localhost:8000/api',
            credentials: {
                email: 'test@who.int',
                password: '123412341234'
            }
        },
        DHIS2APIConfig: {
            baseURL: 'https://covid19.dhis2.org/demo/api',
            credentials: {
                user: 'COVID',
                password: 'StopCovid19!'
            }
        },
        countries: [ 'Trainingland' ],
        rootID: 'GD7TowwI46c'
    }
    console.log(config)
    const dhis2 = new DHIS2API(config.DHIS2APIConfig)
    console.log(dhis2)
    const godata = new GoDataAPI(config.GoDataAPIConfig)
    //console.log("outbreaks", godata.getOutbreaks())
    /*
    async function copyOrgUnits() {
        const res = await int.copyOrganisationUnits(dhis2, godata, config)("orgUnits.json")
        console.log(res)
    }
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
    */

    async function getOrgUnits() {
        console.log("orgUnits", await dhis2.getOrganisationUnitsFromParent(config.rootID))
    }
    getOrgUnits()
    
    return (
        //<div>{ res }</div>
        null
    )
}

export default Actions