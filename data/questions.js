class ValidationResult {
  constructor(isValid, errMessage) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(email);
  return ValidationResult(isValid, isValid || "Please enter a valid email: hello@microassure.com")
}

function notEmptyString(str) {
  const isValid = !(/^\s*$/.test(str));
  return ValidationResult(isValid, isValid || "You didn't type anything, please enter again.")
}

export const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
};

export (questions = {
  buy: [
    {
      question: "Let's get started. What's your full name?",
      responseType: "string",
      id: "name"
    },
    {
      question: "Hi {}, what's your ID number?",
      responseType: "string",
      id: "idNumber"
    },
    {
      question: "What's your email address?",
      responseType: ["string", "email"],
      id: "email",
    },
    {
      question: "How about your emergency email address?",
      responseType: "email",
      id: "emergencyEmail"
    },
    {
      question: "What's your phone number?",
      responseType: "string",
      id: "phoneNumber"
    },
    {
      question: "Great! To collect your claims, we will need your bank name. 🏦",
      responseType: "string",
      id: "bankName"
    },
    {
      question: "Next, we will need your bank account number for us to bank into. 💵",
      responseType: "string",
      id: "bankAccount"
    }
  ],
  claim: [
    {
      question: "When did the accident happen?",
      responseType: "datetime",
      id: "accidentDateTime"
    },
    {
      question: "Where did it happen?",
      responseType: "location",
      id: "accidentLocation"
    },
    {
      question: "Which police station did you report to?",
      responseType: "location",
      id: "policeStation"
    },
    {
      question: "Tell us about the accident.",
      responseType: "string",
      id: "description"
    },
    {
      question: "Please snap a photo of the police report / medical report / death certificate.",
      responseType: "string",
      id: "image"
    }
  ]
});
