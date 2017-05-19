class ValidationResult {
  constructor(isValid, errMessage) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(email);
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid email, e.g. hello@microassure.com"
  );
}

function notEmptyString(str) {
  const isValid = !/^\s*$/.test(str);
  return new ValidationResult(
    isValid,
    isValid || "You didn't type anything, please enter again."
  );
}

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString
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
      question: "Let's get started. Which plan do you want to buy?",
      responseType: "number",
      id: "planIndex"
    },
    {
      question: "Great! How long do you want to be covered with this plan?",
      responseType: "string",
      id: "coverageDuration"
    },
    {
      question: "Awesome. That would be <%= totalPremium %> ($<%= monthlyPremium %> per month.).",
      responseType: null
    },
    {
      question: "Let's get started. What's your full name?",
      responseType: "string",
      id: "name"
    },
    {
      question: "Hi <%= name %>, what's your IC number?",
      responseType: "string",
      id: "idNumber"
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
      question: "Hi. When did the accident happen?",
      responseType: "string",
      id: "accidentDateTime"
    },
    {
      question: "Where did it happen?",
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
      question: "I see. Tell us about your specific injuries.",
      responseType: "string",
      id: "injuryDetails"
    }
    // {
    //   question: "Please snap a photo of the police report / medical report / death certificate.",
    //   responseType: "string",
    //   id: "image"
    // }
  ]
};
