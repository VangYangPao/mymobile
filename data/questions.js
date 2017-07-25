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
      question: "Welcome back <%= fullName %>, here are your protection plans. Which plan would you like to make a claim?",
      responseType: "number",
      id: "claimPolicyNo"
    },
    {
      question: "I will walk you through step by step. I'll do my best to get your claim 👍",
      responseType: null
    },
    {
      question: "Firstly, are you planning to claim for",
      responseType: ["string", "choice"],
      label: "CHOOSE CLAIM TYPE",
      choices: [
        { label: "Death", value: "death" },
        { label: "Permanent Disability", value: "permanentDisability" }
      ],
      include: ["Accidental Death / Permanent Disability"],
      id: "claimType"
    },
    {
      question: "Firstly, are you planning to claim for",
      responseType: ["string", "choice"],
      label: "CHOOSE CLAIM TYPE",
      choices: [
        { label: "Death", value: "death" },
        { label: "Permanent Disability", value: "permanentDisability" },
        { label: "Medical Reimbursement", value: "medicalReimbursement" }
      ],
      include: [
        "Accidental Death / Permanent Disability with Medical Reimbursement"
      ],
      id: "claimType"
    },
    {
      question: "Firstly, are you planning to claim for",
      responseType: ["string", "choice"],
      label: "CHOOSE CLAIM TYPE",
      choices: [
        { label: "Death", value: "death" },
        { label: "Permanent Disability", value: "permanentDisability" },
        { label: "Weekly Compensation", value: "weeklyCompensation" }
      ],
      include: [
        "Accidental Death / Permanent Disability with Weekly Indemnity"
      ],
      id: "claimType"
    },
    {
      question: "I'm so sorry to hear that. I assume you are <%= fullName %>’s claimant/next of kin. Please share with me the date and time of the accident",
      responseType: "date",
      id: "accidentDate",
      include: ["death"]
    },
    {
      question: "Oh… I am sad to hear that. Let me help out on the claim fast. Please share with me the date and time of the accident",
      responseType: "date",
      id: "accidentDate",
      include: ["permanentDisability"]
    },
    {
      question: "Where did it happen?",
      responseType: "string",
      id: "accidentLocation"
    },
    {
      question: "What happened in detail?",
      responseType: "string",
      responseLength: 1800,
      id: "description"
    },
    {
      question: "Please snap a clear photo of the police report, it would be very helpful for this claim.",
      responseType: "images",
      responseLength: 10,
      id: "policeReport"
    },
    {
      question: "What is the injury you suffered? What is the extent of your injury?",
      responseType: "string",
      id: "injuryType",
      include: ["permanentDisability"]
    },
    {
      question: "Try to recall for a moment, have you suffered the same injury before?",
      responseType: ["boolean", "choice"],
      label: "SUFFERED SAME INJURY",
      choices: [
        { label: "Yes, I have", value: true },
        { label: "No, I have not", value: false }
      ],
      id: "sufferedSameInjury",
      include: ["permanentDisability"]
    },
    {
      question: "When did the symptoms first appear?",
      responseType: "date",
      id: "symptomsAppearDate",
      include: ["permanentDisability"]
    },
    {
      question: "Does <%= fullName %> have other insurance coverage for this accident?",
      responseType: ["boolean", "choice"],
      id: "otherInsuranceCoverage",
      label: "OTHER INSURANCE COVERAGE",
      choices: [{ label: "Yes", value: true }, { label: "No", value: false }]
    },
    {
      question: "Have you completed your treatment?",
      responseType: ["boolean", "choice"],
      label: "COMPLETED TREATMENT",
      choices: [
        { label: "Yes, I have", value: true },
        { label: "No, I have not", value: false }
      ],
      id: "completedTreatment",
      include: ["permanentDisability"]
    },
    {
      question: "When is the treatment is expected to be completed?",
      responseType: "date",
      id: "treatmentCompleteDate",
      include: ["permanentDisability"]
    },
    {
      question: "Do you have any hospital or medical leave?",
      responseType: ["boolean", "choice"],
      label: "HOSPITAL LEAVE",
      choices: [
        { label: "Yes, I have", value: true },
        { label: "No, I have not", value: false }
      ],
      id: "medicalLeave",
      include: ["permanentDisability"]
    },
    {
      question: "We are almost done to get you claim fast. I need your help to snap or upload some photos.",
      responseType: null
    },
    {
      question: "Please snap a clear photo of the original medical bills and/or receipts",
      responseType: "images",
      responseLength: 30,
      id: "originalMedicalBill",
      include: ["permanentDisability"]
    },
    {
      question: "<%= fullName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
      responseType: null,
      include: ["permanentDisability"]
    },
    {
      question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of the photocopy medical bills and/or receipts",
      responseType: "images",
      responseLength: 30,
      id: "medicalBill",
      include: ["permanentDisability"]
    },
    {
      question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you. Either one will do.",
      responseType: "images",
      responseLength: 10,
      id: "reimbursementLetter",
      include: ["permanentDisability"]
    },
    {
      question: "Please snap a clear photo of <%= fullName %>’s autopsy report, or, toxicological report, or, coroner’s findings.",
      responseType: "images",
      responseLength: 10,
      id: "autopsyReport",
      include: ["death"]
    },
    {
      question: "Please snap a clear photo of police, or accident report - if death was due to accidental or violent causes.",
      responseType: "images",
      responseLength: 10,
      id: "accidentReport",
      include: ["death"]
    },
    {
      question: "Please snap a clear photo <%= fullName %>’s Last Will of deceased, or, Letter of Administration",
      responseType: "images",
      responseLength: 10,
      id: "will",
      include: ["death"]
    },
    {
      question: "Please snap a clear photo of <%= fullName %>’s Estate Duty of Certificate",
      responseType: "images",
      responseLength: 10,
      id: "estateDutyOfCertificate",
      include: ["death"]
    },
    {
      question: "Please snap a clear photo of any proof of claimant’s relationship to the person who died",
      responseType: "images",
      responseLength: 10,
      id: "relationshipProof",
      include: ["death"]
    },
    {
      question: "For death which happened outside Singapore, please snap a clear photo of <%= fullName %>’s death certificate that is certified true copy by your lawyer or any notary public",
      responseType: "images",
      responseLength: 10,
      id: "deathCertificate",
      include: ["death"]
    },
    {
      question: "For death which happened outside Singapore, please snap a clear photo of the letter from Immigration and Checkpoint Authority, ICA. This letter is issued by ICA for Singaporeans or Permanent Residents, PR who died overseas. The letter confirms ICA saw the Singapore IC, passport and overseas death certificate.",
      responseType: "images",
      responseLength: 10,
      id: "immigrationLetter",
      include: ["death"]
    },
    {
      question: "For death happened outside Singapore, please snap a clear photo of the repatriation report. This report is issued if the body was sent home to Singapore for cremation or burial.",
      responseType: "images",
      responseLength: 10,
      id: "repatriationReport",
      include: ["death"]
    },
    {
      question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim. Please switch on the notification.",
      responseType: "boolean",
      id: "confirm"
    }
  ]
};
