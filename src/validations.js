// @flow
import moment from "moment";
import INVALID_OCCUPATIONS from "../data/invalidOccupations";

function validatePAOccupation(occupationId) {
  const foundOccupation = INVALID_OCCUPATIONS.find(
    occupation => occupation.value === occupationId
  );
  if (foundOccupation) {
    const occupationName = foundOccupation.label;
    return {
      isValid: false,
      errMessage: `${occupationName} is not allowed to buy this policy.`
    };
  }
  return {
    isValid: true,
    errMessage: true
  };
}

function validatePhonePurchaseDate(date) {
  date = moment(date);
  const years = moment.utc().diff(date, "years");
  if (years >= 1) {
    return {
      isValid: false,
      errMessage: "Phone must be less than 1 year old"
    };
  }
  return {
    isValid: true,
    errMessage: true
  };
}

export default (validations = {
  occupation: validatePAOccupation,
  purchaseDate: validatePhonePurchaseDate
});
