import moment from "moment";
import COUNTRIES from "./countries";

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

function validatePhoneNumber(phoneNumber) {
  const isValid = phoneNumber[0] === "8" || phoneNumber[0] === "9";
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

function validateTravelStartDate(startDate) {
  // 2.  Trip Start date must be same as application date or after.
  // 3.  Trip Start date can be 182 days in advance of application Date
  startDate = moment(startDate);
  const applicationDate = moment(new Date());
  const dayDiff = startDate.diff(applicationDate, "days");
  if (dayDiff < 0) {
    return new ValidationResult(
      false,
      "Trip start date cannot be before application date."
    );
  } else if (dayDiff < 0 || dayDiff > 182) {
    return new ValidationResult(
      false,
      "Trip start date cannot be more than 182 days in advance."
    );
  }
  return new ValidationResult(true, true);
}

function validateTravelEndDate(endDate, answers) {
  // 1. Trip Period can't exceed for 182 days (Single Trip).
  endDate = moment(endDate);
  const startDate = answers.departureDate;
  const dayDiff = endDate.diff(startDate, "days");
  if (dayDiff > 182) {
    return new ValidationResult(false, "Trip period cannot exceed 182 days.");
  }
  return new ValidationResult(true, true);
}

function validateChoice(choice) {
  // const validChoice =
  //   choice.hasOwnProperty("label") && choice.hasOwnProperty("value");
  // return new ValidationResult(
  //   validChoice,
  //   "You have selected an invalid option"
  // );
  return new ValidationResult(true);
}

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  images: validateImages,
  imageTable: () => new ValidationResult(true, true),
  date: validateDate,
  datetime: validateDate,
  travelStartDate: validateTravelStartDate,
  travelEndDate: validateTravelEndDate,
  choice: validateChoice,
  nric: validateNRIC,
  boolean: validateBoolean
};

export function validateAnswer(question, answer, answers) {
  const { responseType } = question;
  const responseTypes = [].concat(responseType);
  if (Array.isArray(question.id)) {
    // for (var i = 0; i < answer.length; i++) {
    //   const
    //   for (var j = 0; j < responseType.length; j++) {
    //     const res
    //   }
    //   validateFunc = TypeValidators[responseTypes[i]];
    //   response = validateFunc(answer);
    //   if (!response.isValid) return response;
    // }
    // return response;
    return new ValidationResult(true, true);
  }
  var validateFunc;
  for (var i = 0; i < responseTypes.length; i++) {
    validateFunc = TypeValidators[responseTypes[i]];
    response = validateFunc(answer, answers);
    if (!response.isValid) return response;
  }
  return response;
}

const claimIntro = [
  {
    question: "Welcome back <%= fullName %>, here are your protection plans. Which plan would you like to make a claim?",
    responseType: "number",
    id: "claimPolicyNo"
  },
  {
    question: "I will walk you through step by step. I'll do my best to get your claim 👍",
    responseType: null
  }
];

export const paClaimQuestions = [
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
    question: "I'm so sorry to hear that. I assume you are <%= <%= fullName %> %>’s claimant/next of kin. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["death"]
  },
  {
    question: "Oh… I am sad to hear that. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for weekly compensation. To claim, you need to be medically unfit to work for a minimum of 7 days continuously.",
    responseType: null,
    include: ["weeklyCompensation"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for medical reimbursement. How much are you planning to claim?",
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
    responseType: "datetime",
    pastOnly: true,
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
    pastOnly: true,
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
    question: "Does <%= <%= fullName %> %> have other insurance coverage for this accident?",
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
    pastOnly: true,
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
    pastOnly: true,
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
    pastOnly: true,
    id: "returnWorkDate",
    condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave && this.state.answers.hasReturnedToWork",
    include: ["permanentDisability"]
  },
  {
    question: "Here is the final question, has <%= <%= fullName %> %>'s' employer purchased any insurance coverage for this accident? ",
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
    question: "<%= <%= fullName %> %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
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
    question: "Please snap a clear photo of <%= fullName %> death certificate",
    responseType: "images",
    responseLength: 10,
    id: "deathCertificate",
    include: ["death"],
    condition: "this.state.answers.deathInSingapore === true"
  },
  {
    question: "Please snap a clear photo of <%= <%= fullName %> %>’s autopsy report, or, toxicological report, or, coroner’s findings.",
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
    question: "Please snap a clear photo <%= <%= fullName %> %>’s Last Will of deceased, or, Letter of Administration",
    responseType: "images",
    responseLength: 10,
    id: "will",
    include: ["death"],
    condition: "this.state.answers.deathInSingapore === true"
  },
  {
    question: "Please snap a clear photo of <%= <%= fullName %> %>’s Estate Duty of Certificate",
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
];

export const travelClaimQuestions = [
  {
    question: "Firstly, are you planning to claim for...",
    responseType: ["string", "choice"],
    choices: [
      { label: "Death", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      {
        label: "Medical Reimbursement (Overseas)",
        value: "medicalReimbursement"
      },
      {
        label: "Baggage Damaged / Loss in Custody",
        value: "baggageDamaged"
      },
      { label: "Loss of Personal Document", value: "lossOfPersonalDocument" },
      { label: "Travel Delay / Flight Misconnection", value: "travelDelay" },
      {
        label: "Trip Curtailment / Cancellation or Loss of Deposit",
        value: "tripCurtailment"
      },
      { label: "Personal Liability", value: "personalLiability" }
    ],
    id: "claimType"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Death certificate that is certified true copy by your lawyer or any notary public",
        id: "deathCertificate"
      },
      {
        label: "Letter from Immigration and Checkpoint Authority, ICA",
        id: "immigrationLetter"
      },
      {
        label: "Repatriation report",
        id: "repatriationReport"
      },
      {
        label: "Document proof of claimant’s relationship to the person who died",
        id: "relationshipProof"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["death"],
    id: "deathClaimImages"
  },
  {
    question: "I’m so sorry to hear that. I assume you are <%= fullName %>’s claimant/next of kin. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["death"]
  },
  {
    question: "Oh… I am sad to hear that. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, I wish you get well soon. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["medicalReimbursement"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for damaged or loss of baggage while in the custody of others. Please share with me the date and time of damage or loss",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["baggageDamaged"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for loss of personal document. Please share with me the date and time of loss",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["lossOfPersonalDocument"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for trip curtailment (shortening of trip) or cancellation or loss of travel deposit ",
    responseType: null,
    include: ["tripCurtailment"]
  },
  {
    question: "<%= fullName %>, you just selected personal liability ",
    responseType: null,
    include: ["personalLiability"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for travel delay, baggage delay, or flight misconnection. Please share with me the flight details",
    responseType: ["string", "string"],
    labels: ["Airline company", "Flight number"],
    id: ["airlineCompany", "flightNo"],
    include: ["travelDelay"]
  },
  {
    question: "What is the cause of travel delay, baggage delay, or flight misconnection",
    responseType: "string",
    responseLength: 600,
    id: "travelDelayCause",
    include: ["travelDelay"]
  },
  {
    question: "What is the amount you intend to claim?",
    responseType: "number",
    id: "claimAmount",
    include: ["travelDelay"]
  },
  {
    question: "Have you claimed from the airline or other source?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasClaimedFromOtherSource",
    include: ["travelDelay"]
  },

  {
    question: "What is the amount you claimed?",
    responseType: "number",
    id: "claimAmountFromOtherSource",
    include: ["travelDelay"],
    condition: "this.state.answers.hasClaimedFromOtherSource"
  },
  {
    question: "What is the ORIGINAL departure date, time and departing airport?",
    responseType: ["datetime", "string"],
    labels: ["Original Departure Date", "Departure Airport"],
    id: ["originalFlightDepartureDate", "originalFlightDepartureAirport"],
    include: ["travelDelay"]
  },
  {
    question: "What is the ACTUAL departure date, time and departing airport?",
    responseType: ["datetime", "string"],
    labels: ["Actual Departure Date", "Departure Airport"],
    id: ["actualFlightDepartureDate", "actualFlightDepartureAirport"],
    include: ["travelDelay"]
  },
  {
    question: "What is the cause of trip curtailment or cancellation? ",
    responseType: "string",
    responseLength: 600,
    id: "causeOfTripCurtailment",
    include: ["tripCurtailment"]
  },
  {
    question: "Please share with me the date of trip curtailment or cancellation",
    responseType: "date",
    pastOnly: true,
    id: "tripCurtailmentDate",
    include: ["tripCurtailment"]
  },
  {
    question: "If the trip curtailment or cancellation was caused by your medical condition, or your family member’s medical condition, have you or your family member suffered from this condition before? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "sufferedFromConditionBefore",
    include: ["tripCurtailment"]
  },
  {
    question: "Please explain the medical condition in detail",
    responseType: "string",
    id: "medicalCondition",
    include: ["tripCurtailment"],
    condition: "this.state.answers.sufferedFromConditionBefore"
  },
  {
    question: "Please share with me the NAME, ADDRESS and CONTACT of the attending physician",
    responseType: ["string", "string", ["string", "phoneNumber"]],
    labels: ["Name", "Address", "Contact number"],
    id: ["physicianName", "physicianAddress", "physicianContact"],
    include: ["tripCurtailment"],
    condition: "this.state.answers.sufferedFromConditionBefore"
  },
  {
    question: "What happened in detail leading to personal liability? ",
    responseType: "string",
    responseLength: 600,
    id: "personalLiabilityDetail",
    include: ["personalLiability"]
  },
  {
    question: "Was the accident due to carelessness or negligence on your part? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "isDueToCarelessness",
    include: ["personalLiability"]
  },
  {
    question: "Have you admitted fault? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasAdmittedFault",
    include: ["personalLiability"]
  },
  // {
  //   question: "Please provide the name and contact of witness",
  //   responseType: "table",
  //   columns: [
  //     { label: "Name", id: "name", type: "string" },
  //     { label: "Contact", id: "contact", type: "string" }
  //   ],
  //   id: "witnesses",
  //   include: ["personalLiability"]
  // },
  {
    question: "Is there any injury sustained by any person or persons?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "injurySustainedByAnyPerson",
    include: ["personalLiability"]
  },
  {
    question: "Please share in detail the injury sustained by the person or persons",
    responseType: "string",
    id: "injuryDetail",
    include: ["personalLiability"],
    condition: "this.state.answers.injurySustainedByAnyPerson"
  },
  {
    question: "Is there any damage to property or belongings? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasDamageToProperty",
    include: ["personalLiability"]
  },
  {
    question: "Please share in detail the extent of damage",
    responseType: "string",
    id: "damageDetail",
    include: ["personalLiability"],
    condition: "this.state.answers.hasDamageToProperty"
  },
  {
    question: "Is your baggage delayed?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "isBaggageDelayed",
    include: ["travelDelay"]
  },
  {
    question: "What is your baggage's ORIGINAL departure date, time and departing airport? ",
    responseType: ["datetime", "string"],
    labels: ["Original Departure Date", "Departure Airport"],
    id: ["originalBaggageDepartureDate", "originalBaggageDepartureAirport"],
    include: ["travelDelay"],
    condition: "this.state.answers.isBaggageDelayed"
  },
  {
    question: "What is your baggage's ACTUAL departure date, time and departing airport? ",
    responseType: ["datetime", "string"],
    labels: ["Actual Departure Date", "Departure Airport"],
    id: ["actualBaggageDepartureDate", "actualBaggageDepartureAirport"],
    include: ["travelDelay"],
    condition: "this.state.answers.isBaggageDelayed"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Original receipt or invoice of deposit paid in advance by you ",
        id: "originalReceipt"
      },
      {
        label: "Written confirmation from airline, or hotel, or travel agency, or service provider indicating non-refundable amount due to unavoidable trip cancellation by you",
        id: "writtenConfirmation"
      },
      {
        label: "Terms and conditions from airline, or hotel, or travel agency, or service provider indicating non-refundable clause",
        id: "termsAndCondition"
      },
      {
        label: "Relationship proof of immediate family member if postponement of trip is due to serious injury/illness/death of immediate family member",
        id: "relationshipProof"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation (if any)",
        id: "travelReceipt"
      },
      {
        label: "Death certificate of immediate family member (if any)",
        id: "familyDeathCertificate"
      },
      {
        label: "Memo/letter from registered medical practitioner certifying your travel companion or immediate family member injury/illness is critical or life-threatening (if any)",
        id: "letterForTravelCompanion"
      },
      {
        label: "Memo/letter from registered medical practitioner certifying you are unfit to travel (if any)",
        id: "letterForSelf"
      }
    ],
    id: "tripCurtailmentImages",
    include: ["tripCurtailment"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Scheduled and revised flight itinerary, or boarding pass",
        id: "boardingPass"
      },
      {
        label: "Written document from airline company on the on the duration of travel (and/or baggage) delay and the cause of travel (and/or baggage) delay",
        id: "delayDocumentFromAirline"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation ",
        id: "travelReceipt"
      },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Written document from airline company on the on the cause of flight misconnection, and stating there is no onward transportation available to you within 6 consecutive hours of your arrival time (if any)",
        id: "flightMisconnectionDocument"
      },
      {
        label: "Property irregularity report, and acknowledgement receipt of baggage received (if any)",
        id: "irregularityReport"
      }
    ],
    id: "travelDelayImages",
    include: ["travelDelay"]
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation"
  },
  {
    question: "What happened in detail? What is the cause of the accident?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    exclude: ["baggageDamaged"]
  },
  {
    question: "What happened in detail (leading to damage or loss)?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    include: ["baggageDamaged"]
  },
  {
    question: "If the damage or loss happened whilst baggage was in transit or in custody, have any steps been taken to claim against them?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "stepsTakenToClaim",
    include: ["baggageDamaged", "lossOfPersonalDocument"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original receipt for replacement of personal document",
        id: "replacementReceipt"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation ",
        id: "travelReceipt"
      },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Police report lodged within 24 hours (if any)",
        id: "policeReport"
      }
    ],
    id: "lossOfPersonalDocumentImages",
    include: ["lossOfPersonalDocument"]
  },
  // {
  //   question: "We are almost done here. I need your help to itemise what are lost or damaged",
  //   responseType: "table",
  //   columns: [
  //     {
  //       label: "Description (make and model)",
  //       id: "description",
  //       type: "string"
  //     },
  //     { label: "Date of Purchase", id: "dateOfPurchase", type: "date" },
  //     { label: "Place of Purchase", id: "placeOfPurchase", type: "string" },
  //     { label: "Original Price", id: "originalPrice", type: "number" },
  //     { label: "Claim Amount", id: "claimAmount", type: "number" }
  //   ],
  //   id: "baggageItems",
  //   include: ["baggageDamaged"]
  // },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original purchase receipts or Warranty cards",
        id: "purchaseReceipts"
      },
      { label: "Photos showing the damage", id: "damagePhotos" },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Property irregularity report (if any)",
        id: "irregularityReport"
      },
      {
        label: "Police report lodged within 24 hours (if any)",
        id: "policeReport"
      }
    ],
    id: "baggageDamagedImages",
    include: ["baggageDamaged"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Tour itinerary",
        id: "tourItinerary"
      },
      { label: "Police report", id: "policeReport" },
      {
        label: "Document proof by third party for claiming bodily injury or property damage against you",
        id: "documentProof"
      }
    ],
    id: "personalLiabilityImages",
    include: ["personalLiability"]
  },
  {
    question: "What is the injury you suffered? What is the extent of your injury?",
    responseType: "string",
    responseLength: 500,
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Try to recall for a moment, have you suffered the same injury before? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasSufferedSameInjury",
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Please explain the injury in detail",
    responseType: "string",
    id: "injuryDetail",
    include: ["permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  {
    question: "When did the symptoms first appear?",
    responseType: "date",
    pastOnly: true,
    id: "symptomsAppearDate",
    include: ["permanentDisability", "medicalReimbursement"]
  },

  {
    question: "Does <%= fullName %> have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["death"]
  },
  {
    question: "Do you have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNumber"],
    labels: ["Insurance company name", "Policy number"],
    condition: "this.state.answers.hasOtherInsuranceCoverage === true",
    include: ["death", "permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Have you completed your treatment?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasCompletedTreatment",
    include: ["permanentDisability"]
  },
  {
    question: "When is the treatment is expected to be completed?",
    responseType: "date",
    pastOnly: true,
    id: "treatmentCompleteDate",
    include: ["permanentDisability"],
    condition: "!this.state.answers.hasCompletedTreatment"
  },
  {
    question: "Do you have any hospital or medical leave?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I do", value: true },
      { label: "No, I don't", value: false }
    ],
    id: "hasMedicalLeave",
    include: ["permanentDisability"]
  },
  {
    question: "Share with me the end date of the medical leave",
    responseType: "date",
    pastOnly: true,
    id: "medicalLeaveDate",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasMedicalLeave"
  },
  {
    question: "During your hospital or medical leave, have you returned to work to do full, or light duties? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasReturnedToWork",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasMedicalLeave"
  },
  {
    question: "Share with me when you returned to work…",
    responseType: "date",
    pastOnly: true,
    id: "returnWorkDate",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasReturnedToWork"
  },

  {
    question: "We are almost done to get you claim fast. I need your help to snap, or upload some photos.",
    responseType: null,
    include: ["permanentDisability"]
  },
  {
    question: "Please snap a clear photo of the boarding pass or flight itinerary",
    responseType: "images",
    responseLength: 30,
    id: "boardingPass",
    include: ["permanentDisability"]
  },
  {
    question: "Please snap a clear photo of the original medical bills and/or receipts. However, if you submitted the original bills/receipts to other insurer or your employer, please snap the photocopy medical bills/receipts",
    responseType: "images",
    responseLength: 30,
    id: "medicalBill",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours ",
    responseType: null,
    include: ["permanentDisability", "medicalReimbursement", "tripCurtailment"]
  },
  {
    question: "If you have submitted the original bills and/or receipts to other insurer or your employer, please snap a clear photo of reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you. Either one will do.",
    responseType: "images",
    responseLength: 10,
    id: "reimbursementLetter",
    include: ["permanentDisability"]
  },

  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original medical bills/receipts (if any)",
        id: "medicalBill"
      },
      { label: "Discharge summary", id: "dischargeSummary" },
      {
        label: "Photocopy medical bills/receipts if original is submitted to other insurer",
        id: "photocopyMedicalBill"
      },
      {
        label: "Medical report",
        id: "medicalReport"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["medicalReimbursement"],
    id: "medicalReimbursementImages"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Death certificate that is certified true copy by your lawyer or any notary public",
        id: "deathCertificate"
      },
      {
        label: "Letter from Immigration and Checkpoint Authority, ICA",
        id: "immigrationLetter"
      },
      {
        label: "Repatriation report",
        id: "repatriationReport"
      },
      {
        label: "Document proof of claimant’s relationship to the person who died",
        id: "relationshipProof"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["death"],
    id: "deathClaimImages"
  },
  {
    question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim. Please switch on the notification. ",
    responseType: null
  }
];

export const mobileClaimQuestions = [
  {
    question: "Oops… Don’t worry. I will walk you through step by step. I'll do my best to get your claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate"
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation"
  },
  {
    question: "How did the damage occur? Please specify in detail",
    responseType: "string",
    responseLength: 600,
    id: "description"
  },
  {
    question: "We are almost done to get your claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "NRIC", id: "nric" },
      {
        label: "Mobile phone IMEI number",
        id: "IMEINumber"
      },
      {
        label: "Receipt indicating your phone’s IMEI number",
        id: "receiptIMEINumber"
      },
      {
        label: "Evidences of damage",
        id: "evidenceOfDamage"
      },
      {
        label: "Make, model and colour of your mobile phone",
        id: "phoneMakeModelColour"
      },
      {
        label: "Damaged phone",
        id: "damagedPhone"
      }
    ],
    id: "mobileImages"
  },
  {
    question: "Please bring a copy of the above images when you submit your mobile phone to any of our listed workshop for claim. Here is the list of workshops",
    responseType: null
  },
  {
    question: "Here is the final question, in the past 3 years, have you made any claim on mobile phone under any type of insurance policy? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasMadeClaim"
  },
  {
    question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim. Please switch on the notification. ",
    responseType: null
  }
];

export const QUESTION_SETS = {
  buy: [
    {
      question: "<%= ['Great choice 😄', 'Awesome choice 😄', 'Nice choice 😄', 'Ahh... our most popular choice 😘', 'Fantastic 😉'][Math.floor(Math.random()*5)] %>",
      responseType: null
    },
    {
      question: "I'll walk you through step-by-step. Let's start with the plan you prefer.",
      responseType: "number",
      exclude: ["mobile"],
      id: "planIndex"
    },
    {
      question: "Which country are you travelling to?",
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
    {
      question: "Nice. Who do you want to insure?",
      responseType: ["string", "choice"],
      choices: [
        { label: "Myself", value: "applicant" },
        { label: "Me and my spouse", value: "spouse" },
        { label: "Me and my children", value: "children" },
        { label: "My family", value: "family" }
      ],
      id: "recipient",
      include: ["travel"]
    },

    {
      question: "How long do you want to be covered for?",
      responseType: "number",
      id: "coverageDuration",
      exclude: ["mobile", "travel"]
    },
    {
      question: "<%= ['Awesome', 'Nice', 'Great'][Math.floor(Math.random()*3)] %>. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: ["travel"]
    },
    {
      question: "For the next steps, I will be asking you some questions to get you covered instantly. Please be patient with my questions. 😬",
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
      responseType: ["string", "nric"],
      id: "NRIC"
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
  claim: claimIntro
};
