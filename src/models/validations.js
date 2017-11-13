// @flow
import moment from "moment";
import { isObservableArray } from "mobx";

export class ValidationResult {
  isValid: boolean;
  errMessage: string | boolean;

  constructor(isValid: boolean, errMessage: string | boolean) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function isNumeric(n) {
  !isNaN(parseFloat(n)) && isFinite(n);
}

function validateNumber(num) {
  // accepts both actual numbers and numeric strings
  const isValid = isNumeric(num) || !isNaN(num);
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
    isValid || "Please enter a valid email, e.g. hello@microumbrella.com"
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
  const isValid =
    (phoneNumber[0] === "8" || phoneNumber[0] === "9") &&
    phoneNumber.length === 8;
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
  const msg = `Please enter a valid Singaporean NRIC/FIN. If you're not a Singaporean, please choose "Passport" on the left of the chat box.`;
  if (str.length != 9) return new ValidationResult(false, msg);

  str = str.toUpperCase();

  var i,
    icArray = [];
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

  const isValid = icArray[8] === theAlpha;
  return new ValidationResult(isValid, isValid || msg);
}

function validateTravelStartDate(startDate) {
  // 2.  Trip Start date must be same as application date or after.
  // 3.  Trip Start date can be 182 days in advance of application Date
  startDate = moment(startDate);
  const applicationDate = moment(new Date());
  const dayDiff = startDate.diff(applicationDate, "days") + 1;
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
  const dayDiff = endDate.diff(startDate, "days") + 1;
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
  return new ValidationResult(true, true);
}

function validateImei(s) {
  if (s.length < 15) {
    return new ValidationResult(
      false,
      "IMEI number must be at least 15-characters long"
    );
  }
  return new ValidationResult(true, true);
}

function validateName(s) {
  const namePattern = /^([A-Za-z ,\.@/\(\)])+$/;
  if (!s.match(namePattern)) {
    return new ValidationResult(
      false,
      "Name must only contain alphabets and these symbols: @, / and ()"
    );
  }
  return new ValidationResult(true, true);
}

const TypeValidators = {
  name: validateName,
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  images: validateImages,
  imei: validateImei,
  imageTable: () => new ValidationResult(true, true),
  date: validateDate,
  datetime: validateDate,
  travelStartDate: validateTravelStartDate,
  travelEndDate: validateTravelEndDate,
  choice: validateChoice,
  nric: validateNRIC,
  multiInput: () => new ValidationResult(true, true),
  table: () => new ValidationResult(true, true),
  boolean: validateBoolean
};

export function validateOneAnswer(
  responseTypes: Array<string>,
  answer: Object,
  answers: Array<Object>
) {
  var validateFunc;
  for (var i = 0; i < responseTypes.length; i++) {
    validateFunc = TypeValidators[responseTypes[i]];
    const response = validateFunc(answer, answers);
    if (!response.isValid) return response;
  }
  return new ValidationResult(true, true);
}

export function validateAnswer(question, answer, answers) {
  const { responseType } = question;
  const responseTypes = [].concat(
    isObservableArray(question.responseType)
      ? question.responseType.slice()
      : question.responseType
  );
  // if (Array.isArray(question.id)) {
  //   const responses = answer.map((subAnswer, idx) => {
  //     const responseType = responseTypes[idx];
  //     const response = validateOneAnswer(
  //       responseTypes,
  //       subAnswer.value,
  //       answers
  //     );
  //     // customize abit for string..
  //     // rest use written type names
  //     if (responseType === "string" && !response.isValid) {
  //       response.errMessage = `${subAnswer.label} cannot be empty.`;
  //     } else {
  //       response.errMessage = `${subAnswer.label} is not a valid ${responseType}.`;
  //     }
  //     return response;
  //   });
  //   return responses;
  //   // const allLegit = responses.every(r => r.isValid);
  //   // if (allLegit) return new ValidationResult(true, true);
  //   // // collate the messages together
  //   // const collatedErrMessage = responses.map(r => r.errMessage).join(" ");
  //   // return new ValidationResult(false, collatedErrMessage);
  // }
  let result = validateOneAnswer(responseTypes, answer, answers);
  if (result.isValid && question.responseLength && answer.length) {
    const { responseLength: maxLength } = question;
    if (answer.length >= maxLength) {
      result = new ValidationResult(
        false,
        `Answer must be not longer than ${maxLength} characters`
      );
    }
  }
  return result;
}
