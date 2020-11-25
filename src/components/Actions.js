import React from 'react'
import DHIS2API from 'dhis2-api-wrapper'
import GoDataAPI from 'godata-api-wrapper'
import { CopyOrganisationUnits } from 'dhis2-godata-interoperability'

const dhis2 = new DHIS2API({
    baseUrl: 'https://covid19.dhis2.org/demo/api',
    credentials: {
        user: 'COVID',
        password: 'StopCovid19!'
    }
}) 

const godata = new GoDataAPI({
    baseUrl: 'http://localhost:8000/api',
    credentials: {
        email: 'test@who.int',
        password: '123412341234'
    }
})
async function getOrgUnits() {
    return await dhis2.getOrganisationUnitsFromParent('GD7TowwI46c')
}

const orgUnits = getOrgUnits()
const Actions = () => {
    const res  = orgUnits.map(orgUnit => <div key={ orgUnit.id }>{ orgUnit.name }</div>)
    return (
    <div>{ res }</div>
    )
}

export default Actions