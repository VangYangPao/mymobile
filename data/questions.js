class ValidationResult {
  constructor(isValid, errMessage) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function validateNumber(num) {
  const isValid = Number.isInteger(num);
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

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  image: notEmptyString,
  date: validateDate,
  choice: () => new ValidationResult(true, true)
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
      question: "Thanks for choosing <%= policy.title %>. ☺️",
      responseType: null
    },
    {
      question: "Let's get started. Where will you be travelling to?",
      responseType: ["string", "choice"],
      choices: [
        { label: "ASEAN", value: "ASEAN" },
        { label: "Asia", value: "Asia" },
        { label: "Worldwide", value: "Worldwide" }
      ],
      include: "Travel Protection",
      id: "travelDestination"
    },
    {
      question: "Great! Who is the recipient for the travel insurance?",
      responseType: ["string", "choice"],
      choices: [
        { label: "Applicant", value: "Applicant" },
        { label: "Insured & Spouse", value: "Insured & Spouse" },
        { label: "Insured & Children", value: "Insured & Children" },
        { label: "Family", value: "Family" }
      ],
      include: "Travel Protection",
      id: "recipient"
    },
    {
      question: "How many days will you be at <%= travelDestination %>?",
      responseType: ["number"],
      include: "Travel Protection",
      id: "travelDuration"
    },
    {
      question: "Let's get started. Which plan do you want to buy?",
      responseType: "number",
      id: "planIndex"
    },
    {
      question: "Great! How long do you want to be covered with this plan?",
      responseType: "number",
      id: "coverageDuration",
      exclude: "Travel Protection"
    },
    {
      question: "Awesome. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: "Travel Protection"
    },
    {
      question: "Awesome. That would be $<%= price %>.",
      responseType: null,
      include: "Travel Protection"
    },
    {
      question: "Tell us about yourself. What's your full name?",
      responseType: "string",
      id: "name"
    },
    {
      question: "Hi <%= name %>, what's your IC number?",
      responseType: "string",
      id: "icNumber"
    },
    {
      question: "Thanks, what email address can we contact you at?",
      responseType: ["string", "email"],
      id: "email"
    },
    {
      question: "How about your emergency email address?",
      responseType: "email",
      id: "emergencyEmail"
    },
    {
      question: "What's your phone number?",
      responseType: ["string", "phoneNumber"],
      id: "phoneNumber"
    },
    {
      question: "Great! To collect your claims, we will need your bank name. 🏦 (Western Union accepted)",
      responseType: "string",
      id: "bankName"
    },
    {
      question: "Next, we will need your bank account number for us to bank into. 💵",
      responseType: "number",
      id: "bankAccount"
    },
    {
      question: "What's your beneficiary's full name?",
      responseType: "string",
      id: "beneficiaryName"
    },
    {
      question: "To bank into your beneficiary's bank account, we need his/her bank name. (Western Union accepted)",
      responseType: "string",
      id: "beneficiaryBankName"
    },
    {
      question: "And what's your beneficiary's bank account number?",
      responseType: "number",
      id: "beneficiaryBankAccount"
    },
    {
      question: "Please send us a picture of your NRIC for verification.",
      responseType: "image",
      id: "icImage"
    },
    {
      question: "Thank you. Please wait while I process your information...",
      responseType: null
    }
  ],
  claim: [
    {
      question: "Hi. When did the accident happen?",
      responseType: "date",
      id: "accidentDateTime"
    },
    {
      question: "Thank you. Where did it happen?",
      responseType: "string",
      id: "accidentLocation"
    },
    {
      question: "Which police station did you report to?",
      responseType: "string",
      id: "policeStation"
    },
    {
      question: "Tell us about the accident.",
      responseType: "string",
      id: "description"
    },
    {
      question: "Thank you. Tell us about your specific injuries.",
      responseType: "string",
      id: "injuryDetails"
    },
    {
      question: "Please snap a photo of the police report / medical report / death certificate.",
      responseType: "image",
      id: "image"
    }
  ]
};
