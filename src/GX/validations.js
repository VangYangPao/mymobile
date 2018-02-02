// @flow
import moment from "moment";
import INVALID_OCCUPATIONS from "../../data/SG/invalidOccupations";

import AppStore from "../../microumbrella-core-sg/stores/AppStore";

import { ValidationResult } from "../../microumbrella-core-sg/src/models/base-validations";
import type { ValidationsType } from "../../types";

function validatePAOccupation(occupationId: number) {
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

function validatePhonePurchaseDate(date: Date) {
  date = moment(date);
  const years = moment()
    .utcOffset(8)
    .diff(date, "years");
  if (years >= 1) {
    return {
      isValid: false,
      errMessage: "Please provide a phone that is less than 1 year old"
    };
  }
  return {
    isValid: true,
    errMessage: true
  };
}

function validatePurchaseIdNumber(
  idNumber: string,
  answers: Object
): Promise<ValidationResult> {
  const Parse = AppStore.Parse;
  const Purchase = Parse.Object.extend("Purchase");
  const policyTypeId = answers.policy.id;
  let innerQuery = new Parse.Query(Purchase);
  innerQuery.equalTo("policyholderIdNo", idNumber);
  let query;
  let todayDate = moment(new Date()).startOf("day");
  let tomorrowDate = moment(todayDate)
    .add(1, "day")
    .toDate();
  todayDate = todayDate.toDate();
  const isPA =
    policyTypeId === "pa" ||
    policyTypeId === "pa_mr" ||
    policyTypeId === "pa_wi";

  if (isPA) {
    const PurchaseAccident = Parse.Object.extend("PurchaseAccident");
    innerQuery.greaterThanOrEqualTo("policyExpiryDate", tomorrowDate);
    innerQuery.equalTo("policyTypeId", "pa");
    query = new Parse.Query(PurchaseAccident);
    query.matchesQuery("purchaseId", innerQuery);
    query.lessThanOrEqualTo("commencementDate", tomorrowDate);
  } else if (policyTypeId === "travel") {
    const PurchaseTravel = Parse.Object.extend("PurchaseTravel");
    const startDate = answers.departureDate;
    const endDate = answers.returnDate;
    innerQuery.equalTo("policyTypeId", "travel");
    query = new Parse.Query(PurchaseTravel);
    query.matchesQuery("purchaseId", innerQuery);
    query.equalTo("startDate", startDate);
    query.equalTo("endDate", endDate);
  } else if (policyTypeId === "mobile") {
    const PurchasePhone = Parse.Object.extend("PurchasePhone");
    const endDate = answers.returnDate;
    innerQuery.equalTo("policyTypeId", "mobile");
    query = new Parse.Query(PurchasePhone);
    query.matchesQuery("purchaseId", innerQuery);
    query.equalTo("commencementDate", todayDate);
  }
  const invalidValidationResult = {
    isValid: false,
    errMessage: `${idNumber} is already used for this policy period.`
  };

  if (query) {
    console.log(query);
    return query.find().then(results => {
      if (results.length) {
        return invalidValidationResult;
      }
      return {
        isValid: true,
        errMessage: true
      };
    });
  }
  return new Promise((resolve, reject) => {
    resolve(invalidValidationResult);
  });
}

function validatePhoneNumber(phoneNumber) {
  const isValid =
    (phoneNumber[0] === "8" || phoneNumber[0] === "9") &&
    phoneNumber.length === 8;
  return {
    isValid,
    errMessage: isValid || "Please enter a valid phone number"
  };
}

const validations: ValidationsType = {
  occupation: validatePAOccupation,
  purchaseDate: validatePhonePurchaseDate,
  purchaseIdNumber: validatePurchaseIdNumber,
  phoneNumber: validatePhoneNumber
};
export default validations;
