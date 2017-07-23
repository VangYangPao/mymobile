class ValidationResult {
  constructor(isValid, errMessage) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function validateNumber(num) {
  const isValid = true;
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid number"
  );
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(email);
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid email, e.g. hello@microassure.com"
  );
}

function validateDate(date) {
  const isValid = date instanceof Date;
  return new ValidationResult(isValid, isValid || "Please enter a valid date");
}

function notEmptyString(str) {
  const isValid = !/^\s*$/.test(str);
  return new ValidationResult(
    isValid,
    isValid || "You didn't type anything, please enter again."
  );
}

function validatePhoneNumber(s) {
  const isValid = true;
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid phone number"
  );
}

function validateImages(arr) {
  const isValid = true;
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid phone number"
  );
}

function validateBoolean(bool) {
  const isValid = typeof bool === "boolean";
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid option"
  );
}

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  images: validateImages,
  date: validateDate,
  choice: () => new ValidationResult(true, true),
  boolean: validateBoolean
};

export function validateAnswer(question, answer) {
  const { responseType } = question;
  const responseTypes = [].concat(responseType);
  var validateFunc;
  for (var i = 0; i < responseTypes.length; i++) {
    validateFunc = TypeValidators[responseTypes[i]];
    response = validateFunc(answer);
    if (!response.isValid) return response;
  }
  return response;
}

export const QUESTION_SETS = {
  buy: [
    {
      question: "<%= ['Great choice 😄', 'Awesome choice 😄', 'Nice choice 😄', 'Ahh... our most popular choice 😘', 'Fantastic 😉'][Math.floor(Math.random()*5)] %>",
      responseType: null
    },
    {
      question: "Let's get started. Where will you be travelling to?",
      responseType: ["string", "choice"],
      label: "SELECT DESTINATION",
      choices: [
        { label: "ASEAN", value: "ASEAN" },
        { label: "Asia", value: "Asia" },
        { label: "Worldwide", value: "Worldwide" }
      ],
      include: ["Travel Protection"],
      id: "travelDestination"
    },
    {
      question: "Great! Who is the recipient for the travel insurance?",
      responseType: ["string", "choice"],
      label: "SELECT RECIPIENT",
      choices: [
        { label: "Applicant", value: "Applicant" },
        { label: "Insured & Spouse", value: "Insured & Spouse" },
        { label: "Insured & Children", value: "Insured & Children" },
        { label: "Family", value: "Family" }
      ],
      include: ["Travel Protection"],
      id: "recipient"
    },
    {
      question: "How many days will you be at <%= travelDestination %>?",
      responseType: ["number"],
      include: ["Travel Protection"],
      id: "travelDuration"
    },
    {
      question: "I'll walk you through step-by-step. Let's start with the plan you prefer.",
      responseType: "number",
      exclude: ["Phone Protection"],
      id: "planIndex"
    },
    {
      question: "How long do you want to be covered?",
      responseType: "number",
      id: "coverageDuration",
      exclude: ["Phone Protection", "Travel Protection"]
    },
    {
      question: "<%= ['Awesome', 'Nice', 'Great'][Math.floor(Math.random()*3)] %>. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: ["Travel Protection"]
    },
    {
      question: "For the next steps, I will be asking you some questions to get you covered instantly.",
      responseType: null
    },
    {
      question: "Please be patient with my questions. 😬",
      responseType: null
    },
    {
      question: "May I know your full name?",
      responseType: "string",
      id: "name"
    },
    {
      question: "Nice to meet you <%= name %>! What's your NRIC/FIN/Passport?",
      responseType: "string",
      id: "ICNumber"
    },
    {
      question: "What's your email address? ✉️",
      responseType: ["string", "email"],
      id: "email"
    },
    {
      question: "What's your mailing address?",
      responseType: "string",
      id: "address"
    },
    {
      question: "We are almost done.",
      responseType: null
    },
    {
      question: "As you are aware, I need your bank name for any future claims.",
      responseType: "string",
      id: "bankName"
    },
    {
      question: "What's your bank account number?",
      responseType: "number",
      id: "bankAccountNumber"
    },
    // {
    //   question: "In the case of death claims, who would you choose to be your beneficiary/next of kin?",
    //   responseType: "string",
    //   id: "beneficiaryName"
    // },
    // {
    //   question: "And what's your beneficiary's NRIC/FIN/Passport?",
    //   responseType: "string",
    //   id: "beneficiaryICNumber"
    // },
    {
      question: "Thank you <%= name %> for the information. I will now bring you to the confirmation page.",
      responseType: null
    }
  ],
  claim: [
    {
      question: "Hi Denzel Tan. Which plan would you like to make a claim?",
      responseType: "number",
      id: "claimPolicyNo"
    },
    {
      question: "Denzel, I will walk you through step by step. I'll do my best to get your claim fast 👍",
      responseType: null
    },
    {
      question: "Firstly, are you planning to claim for DEATH or PERMANENT DISABILITY?",
      responseType: ["string", "choice"],
      label: "CHOOSE CLAIM",
      choices: [
        { label: "Death", value: "death" },
        { label: "Permanent Disability", value: "permanentDisability" }
      ]
    },
    // {
    //   question:
    //     "Firstly, you can download the TRAVEL CLAIM FORM here, and print it before you can fill up. Referring to the TRAVEL CLAIM FORM, there are several documents you have to prepare. Once you printed and filled up, we can proceed to the next step.",
    //   responseType: "boolean",
    //   id: "downloadForm"
    // },
    // {
    //   question: "Share with me the type of accident, loss or illness you wanted to claim",
    //   responseType: ["string", "choice"],
    //   label: "SELECT TYPE",
    //   choices: [
    //     "Personal Accident, Medical, Dental Expenses",
    //     "Loss of Baggage & Personal Effects",
    //     "Loss of Money & Documents",
    //     "Baggage Delay",
    //     "Trip Cancellation or Curtailment",
    //     "Travel Delay / Misconnection / Overbooked Flight",
    //     "Loss of Home Contents due to Burglary",
    //     "Personal Liability",
    //     "Others"
    //   ].map(c => ({ label: c, value: c })),
    //   id: "claimType"
    // },
    {
      question: "Please share with me the date and time of accident",
      responseType: "date",
      id: "accidentDateTime"
    },
    {
      question: "Where did it happen?",
      responseType: "string",
      id: "accidentLocation"
    },
    {
      question: "What happened?",
      responseType: "string",
      id: "description"
    },
    {
      question: "Do you have other coverage for this accident?",
      responseType: ["boolean", "choice"],
      label: "OTHER COVERAGE",
      choices: [
        { label: "Yes, I have", value: true },
        { label: "No, I don't have", value: false }
      ],
      id: "haveOtherCoverage"
    },
    {
      question: "Here is the final question, what's the amount you intend to claim?",
      responseType: "number",
      id: "claimAmount"
    },
    {
      question: `Denzel, the Singapore Laws requires you to mail supporting documents. 

A1) For death in Singapore – copy of death certificate 
A2) For death outside Singapore 
(a) Certified true copy of death certificate by your lawyer or any notary public 
(b) Letter from Immigration and Checkpoint Authority (ICA) - this letter is issued by ICA for Singaporeans or permanent residents (PR) who died overseas. It confirms they saw the Singapore IC, passport and overseas death certificate 
(c) Repatriation report (if the body was sent home to Singapore for cremation or burial) 

B) Autopsy report, toxicological report or coroner’s findings

C) Proof of policyholder’s or claimant’s relationship to the person who died

D) Police or accident report (if death was due to accidental or violent causes)

E) Last will of deceased or letter of administration

F) Estate duty of certificate 

Please MAIL these supporting documents to HL Assurance office at 11 Keppel Road #11-01 ABI Plaza Singapore 089057.`,
      responseType: null
    },
    // {
    //   question: "You are doing great so far! Great job! If you have the damaged articles, please keep the damaged articles for possible inspection.",
    //   responseType: ["boolean", "choice"],
    //   label: "DAMAGED ARTICLES",
    //   choices: [
    //     { label: "Yes I have!", value: true },
    //     { label: "No, I don't have them.", value: false }
    //   ],
    //   id: "haveDamagedArticles"
    // },
    //     {
    //       question: "No more writing from here onwards! Please switch to camera mode and snap a clear photo(s) of completed travel claim form",
    //       responseType: "images",
    //       id: "claimForm"
    //     },
    //     {
    //       question: "Next, snap a clear photo of boarding pass, OR, flight itinerary, OR, passport personal info pages together with passport page(s) with stamps showing the date of departure and return to Singapore",
    //       responseType: "images",
    //       id: "travelDetails"
    //     },
    //     {
    //       question: "Here is the final step. Kindly submit the TRAVEL CLAIM FORM, together with the required documents stated in the claim form, by post to HL Assurance Office, 11 Keppel Road #11-01, ABI Plaza Singapore 089057",
    //       responseType: null
    //     },
    //     {
    //       question: "Please take a moment to go through the Declaration, Authorization & Customer's Data Privacy statements",
    //       responseType: null
    //     },
    //     {
    //       question: `1. We do solemnly and sincerely declare that the information given is true and correct to the best of my/our knowledge and belief.

    // 2.  We understand that any false or fraudulent statements or any attempt to suppress or conceal any material facts shall render the Policy void and we shall forfeit our rights to claim under the Policy.

    // 3.  We hereby authorise any hospital, medical practitioner or other person who has attended or examined me, to disclose when requested to do so by HL Assurance Pte. Ltd., or its authorised representative, any and all information with respect to any illness or injury, medical history, consultations, prescriptions or treatment, and copies of all hospital or medical records. A photo-stated copy of this authorisation shall be considered as effective and valid as the original.

    // 4.  We hereby authorise and request HL Assurance Pte.Ltd. to pay benefit due in respect of this claim to Denzel Tan (Name as per Identification Card and/or Bank Account)`,
    //       responseType: ["boolean", "choice"],
    //       label: "TERMS & CONDITIONS",
    //       choices: [
    //         { label: "Agree", value: true },
    //         { label: "Disagree", value: false }
    //       ],
    //       id: "agreeTerms"
    //     },
    {
      question: "Thank you. Please wait while I process your submission...",
      responseType: "boolean",
      id: "confirm"
    }
  ]
};
