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
      include: ["Travel Protection"],
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
      question: "Let's get started. Which plan do you want to buy?",
      responseType: "number",
      exclude: ["Phone Protection"],
      id: "planIndex"
    },
    {
      question: "Great! How long do you want to be covered with this plan?",
      responseType: "number",
      id: "coverageDuration",
      exclude: ["Phone Protection", "Travel Protection"]
    },
    {
      question:
        "Awesome. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: ["Travel Protection"]
    },
    {
      question: "Awesome. That would be $<%= price %>.",
      responseType: null,
      include: ["Travel Protection"]
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
      question:
        "Great! To collect your claims, we will need your bank name. 🏦 (Western Union accepted)",
      responseType: "string",
      id: "bankName"
    },
    {
      question:
        "Next, we will need your bank account number for us to bank into. 💵",
      responseType: "number",
      id: "bankAccount"
    },
    {
      question: "What's your beneficiary's full name?",
      responseType: "string",
      id: "beneficiaryName"
    },
    {
      question:
        "To bank into your beneficiary's bank account, we need his/her bank name. (Western Union accepted)",
      responseType: "string",
      id: "beneficiaryBankName"
    },
    {
      question: "And what's your beneficiary's bank account number?",
      responseType: "number",
      id: "beneficiaryBankAccount"
    },
    {
      question:
        "Please send us the front and back of your NRIC for verification.",
      responseType: "images",
      id: "icImage"
    },
    {
      question: "Thank you. Please wait while I process your information...",
      responseType: null
    }
  ],
  claim: [
    {
      question: "Hi Denzel. Choose which policy you want to claim.",
      responseType: "number",
      id: "claimPolicyNo"
    },
    {
      question:
        "You have selected <%= policyName %> as your claim. I will walk you through step by step, as I’ll do my best to get your claim money fast!",
      responseType: null
    },
    {
      question:
        "Firstly, you can download the TRAVEL CLAIM FORM here, and print it before you can fill up. Referring to the TRAVEL CLAIM FORM, there are several documents you have to prepare. Once you printed and filled up, we can proceed to the next step.",
      responseType: "boolean",
      id: "downloadForm"
    },
    {
      question:
        "Share with me the type of accident, loss or illness you wanted to claim",
      responseType: ["string", "choice"],
      choices: [
        "Personal Accident, Medical, Dental and Other Expenses",
        "Loss of Baggage & Personal Effects",
        "Loss of Money & Documents",
        "Baggage Delay",
        "Trip Cancellation or Curtailment",
        "Travel Delay or Misconnection or Overbooked Flight",
        "Loss of Home Contents due to Burglary",
        "Personal Liability",
        "Others"
      ].map(c => ({ label: c, value: c })),
      id: "claimType"
    },
    {
      question: "Where is the place of accident, loss or illness?",
      responseType: "string",
      id: "accidentLocation"
    },
    {
      question: "Tell me the exact date of accident, loss or illness?",
      responseType: "date",
      id: "accidentDateTime"
    },
    {
      question:
        "Please describe the accident, loss or illness. Do your best to be specific in your description.",
      responseType: "string",
      id: "description"
    },
    {
      question:
        "You are doing great so far! Great job! If you have the damaged articles, please keep the damaged articles for possible inspection.",
      responseType: ["boolean", "choice"],
      choices: [
        { label: "Yes I have!", value: true },
        { label: "No, there are no damaged articles.", value: false }
      ],
      id: "haveDamagedArticles"
    },
    {
      question: "How much do you want to claim?",
      responseType: "string",
      id: "claimAmount"
    },
    {
      question:
        "No more writing from here onwards! Please switch to camera mode and snap a clear photo(s) of completed travel claim form",
      responseType: "images",
      id: "claimForm"
    },
    {
      question:
        "Next, snap a clear photo of boarding pass, OR, flight itinerary, OR, passport personal info pages together with passport page(s) with stamps showing the date of departure and return to Singapore",
      responseType: "images",
      id: "travelDetails"
    },
    {
      question:
        "Here is the final step. Kindly submit the TRAVEL CLAIM FORM, together with the required documents stated in the claim form, by post to HL Assurance Office, 11 Keppel Road #11-01, ABI Plaza Singapore 089057",
      responseType: null
    },
    {
      question:
        "Please take a moment to go through the Declaration, Authorization & Customer's Data Privacy statements",
      responseType: null
    },
    {
      question: `1.	I/We do solemnly and sincerely declare that the information given is true and correct to the best of my/our knowledge and belief.

2.	I/We understand that any false or fraudulent statements or any attempt to suppress or conceal any material facts shall render the Policy void and we shall forfeit our rights to claim under the Policy.

3.	I/We hereby authorise any hospital, medical practitioner or other person who has attended or examined me, to disclose when requested to do so by HL Assurance Pte. Ltd., or its authorised representative, any and all information with respect to any illness or injury, medical history, consultations, prescriptions or treatment, and copies of all hospital or medical records. A photo-stated copy of this authorisation shall be considered as effective and valid as the original.

4.	I/We hereby authorise and request HL Assurance Pte.Ltd. to pay benefit due in respect of this claim to Denzel Tan (Name as per Identification Card and/or Bank Account)`,
      responseType: ["boolean", "choice"],
      choices: [
        { label: "Agree", value: true },
        { label: "Disagree", value: false }
      ],
      id: "agreeTerms"
    },
    {
      question: "Thank you. Please wait while I process your submission...",
      responseType: null
    }
  ]
};
