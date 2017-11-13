import COUNTRIES from "./countries";
import PHONE_MAKES from "./phoneMake";
import PHONE_MODELS from "./phoneModels";
import OCCUPATIONS from "./occupations";

const claimIntro = [
  {
    question:
      "Welcome back <%= fullName %>, here are your protection plans. Which policy would you like to make a claim?",
    responseType: "string",
    id: "claimPolicyNo"
  }
];

export const QUESTION_SETS = {
  buy: [
    {
      question:
        "<%= ['Great choice 😄', 'Awesome choice 😄', 'Nice choice 😄', 'Ahh... our most popular choice 😘', 'Fantastic 😉'][Math.floor(Math.random()*5)] %>",
      responseType: null
    },
    {
      question:
        "I'll walk you through step-by-step. Let's start with the plan you prefer.",
      responseType: "number",
      exclude: ["mobile"],
      id: "planIndex"
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
    // {
    //   question: "Which region are you travelling to?",
    //   responseType: "string",
    //   responseType: ["string", "choice"],
    //   label: "SELECT DESTINATION",
    //   choices: [
    //     { label: "South East Asia", value: "ASEAN" },
    //     { label: "Asia", value: "Asia" },
    //     { label: "Worldwide", value: "Worldwide" }
    //   ],
    //   include: ["travel"],
    //   id: "travelDestination"
    // },
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
    // {
    //   question: "Nice. Who do you want to insure?",
    //   responseType: ["string", "choice"],
    //   choices: [
    //     { label: "Myself", value: "applicant" },
    //     { label: "Me and my spouse", value: "spouse" },
    //     { label: "Me and my children", value: "children" },
    //     { label: "My family", value: "family" }
    //   ],
    //   id: "recipient",
    //   include: ["travel"]
    // },
    {
      question: "How long do you want to be covered for?",
      responseType: "number",
      id: "coverageDuration",
      exclude: ["mobile", "travel"]
    },
    // {
    //   question:
    //     "<%= ['Awesome', 'Nice', 'Great'][Math.floor(Math.random()*3)] %>.%>.",
    //   responseType: null,
    //   exclude: ["travel"]
    // },
    {
      question:
        "For the next steps, I will be asking you some questions to get you covered instantly. Please be patient with my questions. 😬",
      responseType: null
    },
    // {
    //   question: "May I know your full name?",
    //   responseType: "multiInput",
    //   columns: [
    //     {
    //       label: "First name",
    //       id: "firstName",
    //       responseType: ["string", "name"],
    //       responseLength: 60
    //     },
    //     {
    //       label: "Last name",
    //       id: "lastName",
    //       responseType: ["string", "name"],
    //       responseLength: 60
    //     }
    //   ]
    // },
    {
      question:
        "Nice to meet you <%= firstName %> <%= lastName %>! What's your Singaporean NRIC? Or if you're a non-Singaporean, what's your Passport number?",
      responseType: ["string", "nric"],
      responseLength: 15,
      id: "idNumber"
    },
    // {
    //   question: "What's your email address? ✉️",
    //   responseType: ["string", "email"],
    //   id: "email"
    // },
    {
      question:
        "What are the details of your spouse or children travelling with you?",
      responseType: "table",
      id: "travellers",
      include: ["travel"],
      columns: [
        {
          label: "First name",
          id: "firstName",
          responseLength: 60,
          responseType: ["string"]
        },
        {
          label: "Last name",
          id: "lastName",
          responseLength: 60,
          responseType: ["string"]
        },
        {
          label: "NRIC/FIN or Passport",
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
          label: "Relationship",
          id: "relationship",
          responseType: ["choice", "number"],
          choices: [{ label: "Spouse", value: 1 }, { label: "Child", value: 2 }]
        }
      ]
    },
    // {
    //   question: "What's your mailing address?",
    //   responseType: "string",
    //   id: "address"
    // },
    {
      question:
        "What's your phone's IMEI number? IMEI number is a unique 15-digit serial number given to every mobile phone. Check this at the back of your phone.",
      responseType: ["string", "imei"],
      id: "serialNo",
      include: ["mobile"]
    },
    {
      question: "What brand is your phone?",
      searchChoices: true,
      responseType: ["string"],
      choices: PHONE_MAKES,
      include: ["mobile"],
      id: "brandID",
      searchOptions: {
        keys: ["label"],
        threshold: 0.2
      }
    },
    {
      question: "And which model is that?",
      searchChoices: true,
      responseType: ["string"],
      choices: PHONE_MODELS,
      include: ["mobile"],
      id: "modelID",
      searchOptions: {
        keys: ["label"],
        threshold: 0.2
      }
    },
    {
      question: "When did you buy it?",
      responseType: ["date"],
      include: ["mobile"],
      pastOnly: true,
      id: "purchaseDate"
    },
    {
      question: "What do you work as?",
      searchChoices: true,
      responseType: ["string"],
      choices: OCCUPATIONS,
      include: ["pa", "pa_mr", "pa_wi"],
      id: "occupation",
      searchOptions: {
        keys: ["label"],
        threshold: 0.2
      }
    },
    // {
    //   question: "As you are aware, I need your bank account for any future claims.",
    //   responseType: ["string", "string"],
    //   id: ["bankName", "bankAccountNumber"],
    //   labels: ["Bank name", "Bank account number"]
    // },
    {
      question:
        "Thank you <%= firstName %> <%= lastName %> for the information. I will now bring you to the confirmation page.",
      responseType: null
    }
  ],
  claim: claimIntro
};
