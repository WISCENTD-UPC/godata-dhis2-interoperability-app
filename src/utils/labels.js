function getFullSteps() {
    return ['Copy Organisation Units', 'Full transfer']
}
  
function getFullStepContent(step) {
    switch (step) {
        case 0:
            return "Get all organisation units from DHIS2, transforms them to fit Go.Data's schema and saves them hierarchally in a json file in ."
        case 1:
            return "Perform a full transfer from DHIS2 to Go.Data (all but organisation units)"
        default:
            return "Unknown step"
    }
}

function getSteps() {
    return ['Copy Organisation Units', 'Create outbreaks', 'Copy cases', 'Copy contacts']
}
  
function getStepContent(step) {
    switch (step) {
        case 0:
            return "Get all organisation units from DHIS2, transforms them to fit Go.Data's schema and saves them hierarchally in a json file in ."
        case 1:
            return "Create Go.Data outbreaks based on the organisation units and tracked entities of the DHIS2 instance."
        case 2:
            return "Transfer tracked entities from DHIS2 to Go.Data, transforming the data to fit Go.Data's schema and assigning an outbreak automatically."
        case 3:
            return "Transfer contacts from DHIS2 to Go.Data, adding aditional persons and the relationships among them."    
        default:
            return "Unknown step"
    }
}

export {
    getFullSteps,
    getFullStepContent,
    getSteps,
    getStepContent
}