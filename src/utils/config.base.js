const config = {
  disease: '2019_N_CO_V',
  dhis2CasesProgram: 'COVID-19 Case-based Surveillance',
  dhis2ContactsProgram: 'COVID-19 Contact Registration & Follow-up',
  dhis2ContactsRelationship: 'Has Been in Contact with',
  dhis2KeyProgramStages: {
    clinicalExamination: 'Stage 1 - Clinical examination and diagnosis',
    labRequest: 'Stage 2 - Lab Request',
    labResults: 'Stage 3 - Lab Results',
    healthOutcome: 'Stage 4 - Health Outcome',
    symptoms: 'Symptoms'
  },
  dhis2KeyAttributes: {
    caseID: 'System Generated Case ID',
    firstName: 'First Name',
    surname: 'Surname',
    sex: 'Sex',
    dateOfBirth: 'Date of birth',
    address: 'Home Address',
    passport: 'Passport Number'
  },
  attributesDefaults: {
    firstName: 'NOT_PROVIDED'
  },
  dhis2KeyDataElements: {
    pregnancy: 'Pregnancy',
    dateOfOnset: 'Date of symptoms onset',
    healthOutcome: 'Health outcome',
    typeOfVaccine: 'Type of vaccine'
  },
  dhis2DataElementsChecks: {
    confirmedTest: [
      [ 'Lab Test Result', 'Positive' ]
    ]
  },
  // 0 -> GROUP, 1 -> EXPAND
  outbreakCreationMode: 0,
  outbreakCreationGroupingLevel: 0,
  followupAssignmentAlgorithms: [ 'ROUND_ROBIN_ALL_TEAMS', 'ROUND_ROBIN_NEAREST_FIT_TEAM' ],
  outbreakConfig: {
    periodOfFollowup: 14,
    frequencyOfFollowUpPerDay: 1,
    noDaysAmongContacts: 14,
    noDaysInChains: 14,
    noDaysNotSeen: 14,
    noLessContacts: 4,
    noDaysNewContacts: 14,
    reportingGeographicalLevelId: 0,
    caseIdMask: "CASE-YYYY-9999",
    contactIdMask: "CONTACT-YYYY-9999",
    longPeriodsBetweenCaseOnset: 1,
    isContactLabResultsActive: false,
    isDateOfOnsetRequired: true,
    generateFollowUpsOverwriteExisting: false,
    generateFollowUpsKeepTeamAssignment: true
  },
  metadata: {
    optionSets: {
      Vaccine: 'Vaccine types'
    }
  },
  countries: [ 'Trainingland' ],
  rootID: 'GD7TowwI46c'
}

export default config

