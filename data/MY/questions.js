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
    responseType: ["choice", "boolean"],
    choices: [
      { label: "Return trip", value: false },
      { label: "One-way trip", value: true }
    ],
    id: "isOneWayTrip",
    include: ["travel"]
  },
  {
    question: "Which country are you travelling to?",
    searchChoices: true,
    responseType: ["string"],
    choices: mappings.countries,
    include: ["travel"],
    id: "travelArea",
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
        label: "Email",
        responseType: ["string", "email"],
        id: "email"
      },
      {
        label: "Relationship",
        id: "travellerType",
        responseLength: 60,
        choices: mappings.travellerType,
        responseType: ["string", "choice"]
      },
      {
        label: "First name",
        id: "firstName",
        responseType: "string"
      },
      {
        label: "Last name (Surname)",
        id: "lastName",
        responseType: "string"
      },
      {
        label: "ID Type",
        id: "idNumberType",
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
        id: "mobilePhone"
      },
      {
        label: "Address 1",
        id: "address1",
        responseLength: 250,
        responseType: ["string"]
      },
      {
        label: "Address 2",
        id: "address2",
        responseLength: 250,
        responseType: ["string"]
      },
      {
        label: "Postcode",
        id: "postcode",
        responseLength: 7,
        responseType: ["string"]
      },
      {
        label: "State",
        id: "state",
        responseLength: 7,
        responseType: ["string", "choice"],
        choices: mappings.state
      }
    ]
  },

  // Accident PA
  {
    question: "How long do you want to be covered?",
    responseType: "string",
    id: "coverageDuration",
    include: ["pa"]
  },
  {
    question: "Which coverage do you want to be added to your PA?",
    responseType: "coverageAddon",
    id: "coverageAddon",
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
    id: "personalDetails",
    columns: [
      {
        label: "ID Type",
        id: "idNumberType",
        responseType: ["choice", "string"],
        choices: mappings.IDType
      },
      {
        label: "ID Number (NRIC/ Passport)",
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
        responseType: ["choice", "string"],
        choices: mappings.gender
      },
      {
        responseType: ["string", "phoneNumber"],
        label: "Mobile Phone No",
        id: "mobilePhone"
      }
    ],
    include: ["pa"]
  },

  // declaration & conclusion
  {
    question:
      "You hereby declare that you are in good health, free from physical deformity, mental or any kind of medical disorder at the commencement date of enrolment.",
    responseType: ["boolean", "choice", "healthDeclaration"],
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

export const QUESTION_SETS = {
  buy: questionTravelPA,
  claim: claimIntro
};
