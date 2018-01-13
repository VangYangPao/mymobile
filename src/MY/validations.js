// @flow
import moment from "moment";
import INVALID_OCCUPATIONS from "../../data/SG/invalidOccupations";

import AppStore from "../../microumbrella-core/stores/AppStore";

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

function validatePurchaseIdNumber(idNumber, answers) {
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

export function validateNRIC(nric: string) {}

export default (validations = {
  occupation: validatePAOccupation,
  purchaseDate: validatePhonePurchaseDate,
  purchaseIdNumber: validatePurchaseIdNumber,
  nric: validateNRIC
});
