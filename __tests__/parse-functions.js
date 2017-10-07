// @flow
import moment from "moment";
import Parse from "parse/react-native";
const Purchase = Parse.Object.extend("Purchase");

import { generateID } from "../src/utils";
import { saveNewPurchase } from "../src/parse/purchase";
import { saveNewClaim } from "../src/parse/claims";

export function testSaveNewAccidentPurchase() {
  const policyTypeId = "pa";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 100;
  const optionId = 0;
  const policyTermsId = 1;
  const commencementDate = new Date();
  const autoRenew = false;
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    policyTermsId,
    commencementDate
  };

  return Parse.User.logIn("x@aa.com", "1234abcd").then(user => {
    return saveNewPurchase(
      policyTypeId,
      pasAppId,
      policyId,
      webAppId,
      premium,
      planId,
      optionId,
      autoRenew,
      user,
      tmTxnRef,
      tmVerifyEnrolment,
      tmPaymentSuccessRes,
      additionalAttributes
    );
  });
}

export function testSaveNewAccidentMRPurchase() {
  const policyTypeId = "pa";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 100;
  const optionId = 1;
  const policyTermsId = 1;
  const commencementDate = new Date();
  const autoRenew = false;
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    policyTermsId,
    commencementDate
  };

  expect.assertions(3);

  return Parse.User.logIn("x@aa.com", "1234abcd").then(user => {
    return saveNewPurchase(
      policyTypeId,
      pasAppId,
      policyId,
      webAppId,
      premium,
      planId,
      optionId,
      autoRenew,
      user,
      tmTxnRef,
      tmVerifyEnrolment,
      tmPaymentSuccessRes,
      additionalAttributes
    );
  });
}

export function testSaveNewAccidentWIPurchase() {
  const policyTypeId = "pa";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 100;
  const optionId = 2;
  const policyTermsId = 1;
  const commencementDate = new Date();
  const autoRenew = false;
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    policyTermsId,
    commencementDate
  };

  expect.assertions(3);

  return Parse.User.logIn("x@aa.com", "1234abcd").then(user => {
    return saveNewPurchase(
      policyTypeId,
      pasAppId,
      policyId,
      webAppId,
      premium,
      planId,
      optionId,
      autoRenew,
      user,
      tmTxnRef,
      tmVerifyEnrolment,
      tmPaymentSuccessRes,
      additionalAttributes
    );
  });
}

export function testSaveNewTravelPurchase() {
  const policyTypeId = "travel";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 1;
  const optionId = null;

  const countryId = 1;
  const startDate = new Date();
  const endDate = moment(new Date())
    .add(2, "days")
    .toDate();
  const children = [];
  const spouse = null;

  const autoRenew = false;
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    countryId,
    startDate,
    endDate,
    spouse,
    children
  };
  expect.assertions(3);

  return Parse.User.logIn("x@aa.com", "1234abcd").then(user => {
    return saveNewPurchase(
      policyTypeId,
      pasAppId,
      policyId,
      webAppId,
      premium,
      planId,
      optionId,
      autoRenew,
      user,
      tmTxnRef,
      tmVerifyEnrolment,
      tmPaymentSuccessRes,
      additionalAttributes
    );
  });
}

export function testSaveNewMobilePurchase() {
  const policyTypeId = "mobile";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 99;
  const optionId = null;

  const serialNo = generateID();
  const purchaseDate = new Date();
  const brandId = 1;
  const modelId = 1;

  const autoRenew = false;
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    serialNo,
    purchaseDate,
    brandId,
    modelId
  };
  expect.assertions(3);

  return Parse.User.logIn("x@aa.com", "1234abcd").then(user => {
    return saveNewPurchase(
      policyTypeId,
      pasAppId,
      policyId,
      webAppId,
      premium,
      planId,
      optionId,
      autoRenew,
      user,
      tmTxnRef,
      tmVerifyEnrolment,
      tmPaymentSuccessRes,
      additionalAttributes
    );
  });
}

export function testSaveNewClaim() {
  const policyTypeId = "pa";
  const answers = {
    images: {
      policeReport: "123.jpg",
      medicalReceipt: "234.png"
    },
    travelImages: {
      policeReport: "123.jpg"
    },
    testing: "123"
  };
  const imageProps = ["images", "travelImages"];
  const Purchase = Parse.Object.extend("Purchase");
  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(currentUser => {
      const query = new Parse.Query(Purchase);
      return query.first();
    })
    .then(purchase => {
      return saveNewClaim(policyTypeId, answers, purchase, imageProps);
    });
}
