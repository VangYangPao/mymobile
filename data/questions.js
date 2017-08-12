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

function validateNRIC(str) {
  if (str.length != 9)
    return new ValidationResult(false, "Please enter a valid NRIC/FIN");

  str = str.toUpperCase();

  var i, icArray = [];
  for (i = 0; i < 9; i++) {
    icArray[i] = str.charAt(i);
  }

  icArray[1] = parseInt(icArray[1], 10) * 2;
  icArray[2] = parseInt(icArray[2], 10) * 7;
  icArray[3] = parseInt(icArray[3], 10) * 6;
  icArray[4] = parseInt(icArray[4], 10) * 5;
  icArray[5] = parseInt(icArray[5], 10) * 4;
  icArray[6] = parseInt(icArray[6], 10) * 3;
  icArray[7] = parseInt(icArray[7], 10) * 2;

  var weight = 0;
  for (i = 1; i < 8; i++) {
    weight += icArray[i];
  }

  var offset = icArray[0] == "T" || icArray[0] == "G" ? 4 : 0;
  var temp = (offset + weight) % 11;

  var st = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  var fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];

  var theAlpha;
  if (icArray[0] == "S" || icArray[0] == "T") {
    theAlpha = st[temp];
  } else if (icArray[0] == "F" || icArray[0] == "G") {
    theAlpha = fg[temp];
  }

  return new ValidationResult(icArray[8] === theAlpha, true);
}

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  images: validateImages,
  date: validateDate,
  choice: () => new ValidationResult(true, true),
  nric: validateNRIC,
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
      include: ["travel"],
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
      include: ["travel"],
      id: "recipient"
    },
    {
      question: "How many days will you be at <%= travelDestination %>?",
      responseType: ["number"],
      include: ["travel"],
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
      exclude: ["Phone Protection", "travel"]
    },
    {
      question: "<%= ['Awesome', 'Nice', 'Great'][Math.floor(Math.random()*3)] %>. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: ["travel"]
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
      responseType: ["string", "string"],
      id: ["firstName", "lastName"],
      labels: ["First name", "Last name"]
    },
    // {
    //   question: "May I know your first name?",
    //   responseType: "string",
    //   id: "firstName"
    // },
    // {
    //   question: "May I know your last name?",
    //   responseType: "string",
    //   id: "lastName"
    // },
    {
      question: "Nice to meet you <%= lastName %> <%= firstName %>! What's your NRIC/FIN/Passport?",
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
    // {
    //   question: "As you are aware, I need your bank account for any future claims.",
    //   responseType: ["string", "string"],
    //   id: ["bankName", "bankAccountNumber"],
    //   labels: ["Bank name", "Bank account number"]
    // },
    {
      question: "Thank you <%= lastName %> <%= firstName %> for the information. I will now bring you to the confirmation page.",
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

    // CLAIM TYPE
    {
      question: "Firstly, are you planning to claim for",
      responseType: ["string", "choice"],
      label: "CHOOSE CLAIM TYPE",
      choices: [
        { label: "Death", value: "death" },
        { label: "Permanent Disability", value: "permanentDisability" }
      ],
      include: ["pa"],
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
      include: ["pa_mr"],
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
      include: ["pa_wi"],
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
      question: "FULLNAME, you just selected the option to claim for weekly compensation. To claim, you need to be medically unfit to work for a minimum of 7 days continuously.",
      responseType: null,
      include: ["weeklyCompensation"]
    },
    {
      question: "FULLNAME, you just selected the option to claim for medical reimbursement. How much are you planning to claim?",
      responseType: ["boolean", "choice"],
      id: "reimbursementMoreThan5000",
      choices: [
        {
          label: "$1 - $5000",
          value: false
        },
        { label: ">$5000", value: true }
      ],
      include: ["medicalReimbursement"]
    },

    {
      question: "Please share with me the date and time of the accident?",
      responseType: "date",
      include: ["weeklyCompensation"]
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
      exclude: ["death"]
    },
    {
      question: "Try to recall for a moment, have you suffered the same injury before?",
      responseType: ["boolean", "choice"],
      label: "SUFFERED SAME INJURY",
      choices: [
        { label: "Yes, I have", value: true },
        { label: "No, I have not", value: false }
      ],
      id: "hasSufferedSameInjury",
      exclude: ["death"]
    },
    {
      question: "Please explain the injury in detail",
      responseType: "string",
      id: "injuryDetail",
      exclude: ["death"],
      condition: "this.state.answers.hasSufferedSameInjury"
    },
    {
      question: "When did the symptoms first appear?",
      responseType: "date",
      id: "symptomsAppearDate",
      include: ["permanentDisability", "medicalReimbursement"],
      condition: "this.state.answers.hasSufferedSameInjury"
    },
    {
      question: "Do you have other insurance coverage for this accident?",
      responseType: ["boolean", "choice"],
      id: "hasOtherInsuranceCoverage",
      label: "OTHER INSURANCE COVERAGE",
      choices: [
        {
          label: "Yes",
          value: true
        },
        { label: "No", value: false }
      ],
      include: ["permanentDisability", "medicalReimbursement"]
    },
    {
      question: "Does <%= fullName %> have other insurance coverage for this accident?",
      responseType: ["boolean", "choice"],
      id: "hasOtherInsuranceCoverage",
      label: "OTHER INSURANCE COVERAGE",
      choices: [
        {
          label: "Yes",
          value: true
        },
        { label: "No", value: false }
      ],
      include: ["death"]
    },
    {
      question: "What is the insurance company and policy number?",
      responseType: ["string", "string"],
      id: ["otherInsuranceCo", "otherPolicyNumber"],
      labels: ["Insurance company name", "Policy number"],
      condition: "this.state.answers.hasOtherInsuranceCoverage === true"
    },
    {
      question: "Have you completed your treatment?",
      responseType: ["boolean", "choice"],
      id: "hasCompletedTreatment",
      choices: [
        {
          label: "Yes",
          value: true
        },
        { label: "No", value: false }
      ],
      include: ["permanentDisability", "medicalReimbursement"],
      condition: "this.state.answers.claimType === 'permanentDisability' || (this.state.answers.claimType === 'medicalReimbursement' && this.state.answers.reimbursementMoreThan5000)"
    },
    {
      question: "When is the treatment is expected to be completed?",
      responseType: ["date"],
      id: "treatmentCompleteDate",
      condition: "!this.state.answers.hasCompletedTreatment",
      include: ["permanentDisability", "medicalReimbursement"]
    },
    {
      question: "Do you have any hospital or medical leave? ",
      responseType: ["boolean", "choice"],
      id: "hasMedicalLeave",
      choices: [
        {
          label: "Yes",
          value: true
        },
        { label: "No", value: false }
      ],
      condition: "!this.state.answers.hasOtherInsuranceCoverage",
      include: ["permanentDisability"]
    },
    {
      question: "Share with me the medical leave date",
      responseType: ["date"],
      id: "medicalLeaveDate",
      condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave",
      include: ["permanentDisability"]
    },
    {
      question: "During your hospital or medical leave, have you returned to work to do full, or light duties? ",
      responseType: ["boolean", "choice"],
      id: "hasReturnedToWork",
      choices: [
        {
          label: "Yes",
          value: true
        },
        { label: "No", value: false }
      ],
      condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave",
      include: ["permanentDisability"]
    },
    {
      question: "Share with me when you returned to work",
      responseType: ["date"],
      id: "returnWorkDate",
      condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave && this.state.answers.hasReturnedToWork",
      include: ["permanentDisability"]
    },
    {
      question: "Here is the final question, has <%= fullName %>'s' employer purchased any insurance coverage for this accident? ",
      responseType: ["string", "string"],
      responseType: ["boolean", "choice"],
      id: "hasEmployerInsuranceCoverage",
      label: "OTHER INSURANCE COVERAGE",
      choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
      include: ["death"]
    },
    {
      question: "What is the insurance company and policy number?",
      responseType: ["string", "string"],
      id: ["employerInsuranceCo", "employerPolicyNo"],
      labels: ["Insurance company name", "Policy number"],
      condition: "this.state.answers.hasEmployerInsuranceCoverage === true",
      include: ["death"]
    },

    // 2nd half
    {
      question: "We are almost done to get you claim fast. I need your help to snap or upload some photos.",
      responseType: null
    },
    {
      question: "Did the death happen in Singapore or outside of Singapore?",
      responseType: ["string", "choice"],
      id: "deathInSingapore",
      choices: [
        { label: "In Singapore", value: true },
        { label: "Outside of Singapore", value: false }
      ],
      include: ["death"]
    },
    {
      question: "Please snap a clear photo of the original medical bills and/or receipts",
      responseType: "images",
      responseLength: 30,
      id: "originalMedicalBill",
      exclude: ["death"]
    },
    {
      question: "<%= fullName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
      responseType: null,
      exclude: ["death"]
    },
    {
      question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of the photocopy medical bills and/or receipts",
      responseType: "images",
      responseLength: 30,
      id: "otherMedicalBill",
      exclude: ["death"]
    },
    {
      question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you. Either one will do.",
      responseType: "images",
      responseLength: 10,
      id: "reimbursementLetter",
      exclude: ["death"]
    },
    {
      question: "If you had hospital admission, please snap a clear photo of the In-patient Discharge Summary",
      responseType: "images",
      responseLength: 10,
      id: "dischargeSummary",
      include: ["medicalReimbursement"],
      condition: "this.state.answers.reimbursementMoreThan5000"
    },
    {
      question: "If you had hospital admission, please snap a clear photo of the Medical Report (indicating your diagnosis)",
      responseType: "images",
      responseLength: 10,
      id: "medicalReport",
      include: ["medicalReimbursement"],
      condition: "this.state.answers.reimbursementMoreThan5000"
    },
    {
      question: "If you had hospital admission, please download the ATTENDING PHYSICIAN STATEMENT. Print out, let your doctor fill up, and finally snap a clear photo of the APS",
      responseType: "images",
      responseLength: 10,
      id: "physicianStatement",
      include: ["medicalReimbursement"],
      condition: "this.state.answers.reimbursementMoreThan5000"
    },

    // DEATH
    {
      question: "Please snap a clear photo of FULLNAME death certificate",
      responseType: "images",
      responseLength: 10,
      id: "deathCertificate",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },
    {
      question: "Please snap a clear photo of <%= fullName %>’s autopsy report, or, toxicological report, or, coroner’s findings.",
      responseType: "images",
      responseLength: 10,
      id: "autopsyReport",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },
    {
      question: "Please snap a clear photo of police, or accident report - if death was due to accidental or violent causes.",
      responseType: "images",
      responseLength: 10,
      id: "accidentReport",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },
    {
      question: "Please snap a clear photo <%= fullName %>’s Last Will of deceased, or, Letter of Administration",
      responseType: "images",
      responseLength: 10,
      id: "will",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },
    {
      question: "Please snap a clear photo of <%= fullName %>’s Estate Duty of Certificate",
      responseType: "images",
      responseLength: 10,
      id: "estateDutyOfCertificate",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },
    {
      question: "Please snap a clear photo of any proof of claimant’s relationship to the person who died",
      responseType: "images",
      responseLength: 10,
      id: "relationshipProof",
      include: ["death"],
      condition: "this.state.answers.deathInSingapore === true"
    },

    {
      question: "For death which happened outside Singapore, please snap a clear photo of the letter from Immigration and Checkpoint Authority, ICA. This letter is issued by ICA for Singaporeans or Permanent Residents, PR who died overseas. The letter confirms ICA saw the Singapore IC, passport and overseas death certificate.",
      responseType: "images",
      responseLength: 10,
      id: "immigrationLetter",
      include: ["death"],
      condition: "!this.state.answers.deathInSingapore"
    },
    {
      question: "For death happened outside Singapore, please snap a clear photo of the repatriation report. This report is issued if the body was sent home to Singapore for cremation or burial.",
      responseType: "images",
      responseLength: 10,
      id: "repatriationReport",
      include: ["death"],
      condition: "!this.state.answers.deathInSingapore"
    },

    // WEEKLY COMPENSATION
    {
      question: "Please snap a clear photo of the medical certificate issued by a registered physician in Singapore",
      responseType: "images",
      responseLength: 10,
      id: "medicalCertificate",
      include: ["weeklyCompensation"]
    },

    // CONFIRM
    {
      question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim. Please switch on the notification.",
      responseType: "boolean",
      id: "confirm"
    }
  ]
};
