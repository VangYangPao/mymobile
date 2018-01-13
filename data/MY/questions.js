// @flow
import COUNTRIES from "./countries";
import OCCUPATIONS from "./occupations";
import INVALID_OCCUPATIONS from "./invalidOccupations";
import RETURN_SINGLE_TRIP_OPTIONS from "./return-single-trip";

import type { QuestionSetType, BuyClaimQuestionSetType } from "../../types";

const ALL_OCCUPATIONS = OCCUPATIONS.concat(INVALID_OCCUPATIONS);
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
  {
    question: "Is it a return or one-way trip?",
    responseType: ["choice", "string"],
    choices: RETURN_SINGLE_TRIP_OPTIONS,
    id: "tripType",
    include: ["travel"]
  },
  {
    question: "Which country are you travelling to?",
    searchChoices: true,
    responseType: ["string"],
    choices: COUNTRIES,
    include: ["travel"],
    id: "travelDestination",
    searchOptions: {
      keys: ["label"],
      threshold: 0.2
    }
  },
  {
    question: "Coverage Period",
    responseType: "number",
    id: "coverageDuration",
    include: ["pa"]
  },
  {
    question: "Trip Start Date",
    responseType: ["date", "travelStartDate"],
    futureOnly: true,
    id: "departureDate",
    include: ["travel"]
  },
  {
    question: "Trip End Date",
    responseType: ["date", "travelEndDate"],
    futureOnly: true,
    minDateFrom: "departureDate",
    id: "returnDate",
    include: ["travel"],
    defaultValue: "this.state.answers.departureDate"
  },
  {
    question: "Emergency Email Address ✉️",
    responseType: ["string", "email"],
    id: "email"
  },
  {
    question: "Do you want to include coverage for your Spouse?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I want", value: true },
      { label: "No, I do not want", value: false }
    ],
    id: "yesWantToAdd"
  },
  {
    question:
      "Do you want to include coverage for your children (Maximum up to 4)?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I want", value: true },
      { label: "No, I do not want", value: false }
    ],
    id: "yesWantToAdd"
  },
  {
    question: "Who is your beneficiary? NRIC?",
    responseType: ["purchaseIdNumber", "string", "nric"],
    responseLength: 15,
    id: "idNumber"
  },
  {
    question: "Insured Person (Traveller A) details",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      },
      {
        question: "Email",
        responseType: ["string", "email"],
        id: "email"
      },
      {
        question: "Mobile Phone No",
        responseType: ["string", "mobile"],
        id: "mobile"
      }
    ]
  },

  {
    question: "Traveller B - Spouse of Policy Holder",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      },
      {
        question: "Email",
        responseType: ["string", "email"],
        id: "email"
      },
      {
        question: "Mobile Phone No",
        responseType: ["string", "mobile"],
        id: "mobile"
      }
    ]
  },

  {
    question: "Traveller 1- Child of Policy Holder",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      }
    ]
  },

  {
    question: "Traveller 2- Child of Policy Holder",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      }
    ]
  },
  {
    question: "Traveller 3- Child of Policy Holder",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      }
    ]
  },

  {
    question: "Traveller 4- Child of Policy Holder",
    responseType: "table",
    id: "travellers",
    include: ["travel"],
    columns: [
      {
        label: "Surname",
        id: "surName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "Given Name",
        id: "givenName",
        responseLength: 60,
        responseType: ["string"]
      },
      {
        label: "ID Type ID Number",
        id: "idNumber",
        responseType: "string"
      },
      {
        label: "Date of birth",
        id: "DOB",
        responseType: "date",
        pastOnly: true
      },
      {
        label: "Gender",
        id: "gender",
        responseType: ["choice", "number"],
        choices: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }]
      }
    ]
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
