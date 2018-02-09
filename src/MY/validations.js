// @flow
import moment from "moment";
import INVALID_OCCUPATIONS from "../../data/SG/invalidOccupations";

import AppStore from "../../microumbrella-core/stores/AppStore";
import { ValidationResult } from "../../microumbrella-core/src/models/base-validations";

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

function validatePhonePurchaseDate(date: Date) {
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

function validatePurchaseIdNumber(idNumber: string, answers: Object) {
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
    // const months = answers.coverageDuration;
    // const policyTermsId = MAPPINGS.paTerms[months];
    innerQuery.equalTo("policyTypeId", "pa");
    query = new Parse.Query(PurchaseAccident);
    query.matchesQuery("purchaseId", innerQuery);
    // query.equalTo("policyTermsId", policyTermsId);
    query.equalTo("commencementDate", tomorrowDate);
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
  return query.find().then(results => {
    if (results.length) {
      return {
        isValid: false,
        errMessage: `${idNumber} is already used for this policy period.`
      };
    }
    return {
      isValid: true,
      errMessage: true
    };
  });
}

export function validatePhoneNumber(phoneNumber: string) {
  const prefix = phoneNumber.slice(0, 2);
  if (prefix !== "01") {
    return new ValidationResult(false, "Phone number must begin with 01");
  }
  if (phoneNumber.length >= 15) {
    return new ValidationResult(
      false,
      "Phone number cannot be longer than 15 numbers"
    );
  }
  return new ValidationResult(true, true);
}

export function validateNRIC(nric: string) {}

export function validateDeclaration(response: boolean) {
  if (!response) {
    return new ValidationResult(
      false,
      "You are not allowed to buy the takaful."
    );
  }
}

export default {
  occupation: validatePAOccupation,
  purchaseDate: validatePhonePurchaseDate,
  purchaseIdNumber: validatePurchaseIdNumber,
  nric: validateNRIC,
  phoneNumber: validatePhoneNumber,
  coverageAddon: () => new ValidationResult(true, true),
  healthDeclaration: validateDeclaration
};
