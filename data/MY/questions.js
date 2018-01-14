// @flow
import * as mappings from "./mappings";

import type { QuestionSetType, BuyClaimQuestionSetType } from "../../types";

const claimIntro: QuestionSetType = [
  {
    question:
      "Welcome back <%= firstName %> <%= lastName %>, here are your protection plans. Which policy would you like to make a claim?",
    responseType: "string",
    id: "claimPolicyNo"
  }
];
const questionTravelPA: QuestionSetType = [
  {
    question:
      "<%= ['Great choice 😄', 'Awesome choice 😄', 'Nice choice 😄', 'Ahh... our most popular choice 😘', 'Fantastic 😉'][Math.floor(Math.random()*5)] %>",
    responseType: null
  },
  {
    question:
      "I'll walk you through step-by-step. Let's start with the plan you prefer.",
    responseType: "number",
    id: "planIndex"
  },

  // Travel PA
  {
    question: "Is it a return or one-way trip?",
    responseType: ["choice", "string"],
    choices: mappings.tripType,
    id: "tripType",
    include: ["travel"]
  },
  {
    question: "Which country are you travelling to?",
    searchChoices: true,
    responseType: ["string"],
    choices: mappings.countries,
    include: ["travel"],
    id: "travelDestination",
    searchOptions: {
      keys: ["label"],
      threshold: 0.7
    }
  },
  {
    question: "When are you departing?",
    responseType: ["date", "travelStartDate"],
    futureOnly: true,
    id: "departureDate",
    include: ["travel"]
  },
  {
    question: "When are you returning?",
    responseType: ["date", "travelEndDate"],
    futureOnly: true,
    minDateFrom: "departureDate",
    id: "returnDate",
    include: ["travel"],
    defaultValue: "this.state.answers.departureDate"
  },
  {
    question:
      "What are the details of your spouse or children travelling with you?",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Address (with postcode, state, city)",
        id: "address",
        responseLength: 250,
        responseType: ["string"]
      },
      {
        label: "Email",
        responseType: ["string", "email"],
        id: "email"
      },
      {
        label: "Relationship",
        id: "relationship",
        responseLength: 60,
        choices: mappings.travellerType,
        responseType: ["string", "choice"]
      },
      {
        label: "Name (as per IC/other ID/passport)",
        id: "givenName",
        responseType: "string"
      },
      {
        label: "ID Type",
        id: "idType",
        responseType: ["choice", "string"],
        choices: mappings.IDType
      },
      {
        label: "ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "string"],
        choices: mappings.gender
      },
      {
        label: "Nationality",
        id: "nationality",
        responseType: ["choice", "string"],
        choices: mappings.nationality
      },
      {
        label: "Marital Status",
        id: "maritalStatus",
        responseType: ["choice", "string"],
        choices: mappings.maritalStatus
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Occupation",
        id: "occupation",
        responseType: ["choice", "string"],
        choices: mappings.occupation
      },
      {
        label: "Mobile Phone No",
        responseType: ["string", "mobile"],
        id: "mobile"
      }
    ]
  },

  // Accident PA
  {
    question: "Coverage Period",
    responseType: "number",
    id: "coverageDuration",
    include: ["pa"]
  },
  {
    question:
      "Have you and/or any named person application has been rejected by any Insurance/ Takaful operator before?",
    responseType: ["boolean", "choice"],
    id: "hasPerson",
    label: "REJECTED PERSON",
    choices: [
      {
        label: "Yes",
        value: true
      },
      {
        label: "No",
        value: false
      }
    ],
    include: ["pa"]
  },
  {
    question: "Key in your personal details.",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "First Name",
        id: "firstName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Last Name",
        id: "lastName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type",
        id: "idType",
        responseType: ["choice", "string"],
        choices: mappings.IDType
      },
      {
        label: "ID Number (NRIC/ Passport)",
        id: "idType",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Email",
        id: "email",
        responseType: "string"
      },
      {
        question: "Mobile Phone No",
        responseType: ["string", "mobile"],
        id: "mobile"
      }
    ],
    include: ["pa"]
  },
  {
    question:
      "You hereby declare that you are in good health, free from physical deformity, mental or any kind of medical disorder at the commencement date of enrolment.",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I'm fine", value: true },
      { label: "No, I'm not", value: false }
    ],
    id: "healthDeclaration"
  },
  {
    question:
      "Thank you <%= firstName %> <%= lastName %> for the information. I will now bring you to the confirmation page.",
    responseType: null
  }
];

//const questionPA = [

//    {
//        question:
//        "Choose Plan",
//        responseType: "number",
//        exclude: ["mobile"],
//        id: "planIndex"
//    },
//    {
//        question: "Destination (users type in country – no region)",
//        searchChoices: true,
//        responseType: ["string"],
//        choices: COUNTRIES,
//        include: ["travel"],
//        id: "travelDestination",
//        searchOptions: {
//            keys: ["label"],
//            threshold: 0.2
//        }
//    },
//    {
//        question: "Coverage Period",
//        responseType: "number",
//        id: "coverageDuration",
//        exclude: ["mobile", "travel"]
//    },
//    {
//        question: "Emergency Email Address ✉️",
//        responseType: ["string", "email"],
//        id: "email"
//    },
//    {
//        question:
//        "Do you want to include coverage for your Spouse?",
//        responseType: ["boolean", "choice"],
//        choices: [
//            { label: "Yes, I want", value: true },
//            { label: "No, I do not want", value: false }
//        ],
//        id: "yesWantToAdd"
//    },
//    {
//        question:
//        "Do you want to include coverage for your children (Maximum up to 4)?",
//        responseType: ["boolean", "choice"],
//        choices: [
//            { label: "Yes, I want", value: true },
//            { label: "No, I do not want", value: false }
//        ],
//        id: "yesWantToAdd"
//    },
//    {
//        question:
//        "Who is your beneficiary? NRIC?",
//        responseType: ["purchaseIdNumber", "string", "nric"],
//        responseLength: 15,
//        id: "idNumber"
//    },
//    {
//        question:
//        "Insured Person (Traveller A) details",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            },
//            {
//                question: "Email",
//                responseType: ["string", "email"],
//                id: "email"
//            },
//            {
//                question: "Mobile Phone No",
//                responseType: ["string", "mobile"],
//                id: "mobile"
//            }
//        ]
//    },

//    {
//        question:
//        "Traveller B - Spouse of Policy Holder",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            },
//            {
//                question: "Email",
//                responseType: ["string", "email"],
//                id: "email"
//            },
//            {
//                question: "Mobile Phone No",
//                responseType: ["string", "mobile"],
//                id: "mobile"
//            }
//        ]
//    },

//    {
//        question:
//        "Traveller 1- Child of Policy Holder",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            }
//        ]
//    },

//    {
//        question:
//        "Traveller 2- Child of Policy Holder",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            }
//        ]
//    },
//    {
//        question:
//        "Traveller 3- Child of Policy Holder",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            }
//        ]
//    },

//    {
//        question:
//        "Traveller 4- Child of Policy Holder",
//        responseType: "table",
//        id: "travellers",
//        include: ["travel"],
//        columns: [
//            {
//                label: "Surname",
//                id: "surName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "Given Name",
//                id: "givenName",
//                responseLength: 60,
//                responseType: ["string"]
//            },
//            {
//                label: "ID Type ID Number",
//                id: "idNumber",
//                responseType: "string"
//            },
//            {
//                label: "Date of birth",
//                id: "DOB",
//                responseType: "date",
//                pastOnly: true
//            },
//            {
//                label: "Gender",
//                id: "gender",
//                responseType: ["choice", "number"],
//                choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
//            }
//        ]
//    }
//];

export const QUESTION_SETS = {
  buy: questionTravelPA,
  claim: claimIntro
};
