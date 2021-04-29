function getFullSteps() {
    return ['Full transfer']
}
  
function getFullStepContent(step) {
    switch (step) {
        case 0:
            return "Perform a full transfer from Go.Data to DHIS2."
        default:
            return "Unknown step"
    }
}

function getSteps() {
    return ['Copy Locations', 'Copy tracked entity instances with events']
}
  
function getStepContent(step) {
    switch (step) {
        case 0:
            return "Get all locations from Go.Data, transform them to fit DHIS2's schema and save them on this DHIS2 instance."
        case 1:
            return "Transfer cases from Go.Data to DHIS2, adding lab test results and health outcome information."    
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