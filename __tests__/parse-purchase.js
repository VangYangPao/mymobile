// @flow
// import "react-native";
// import "isomorphic-form-data";
// import "isomorphic-fetch";
import moment from "moment";

// import MockStorage from "./MockStorage";
// const storageCache = {};
// const AsyncStorage = new MockStorage(storageCache);
// jest.setMock("AsyncStorage", AsyncStorage);

import { generateID } from "../src/utils";

jest.mock("parse/react-native", () => {
  var ParseNode = require("parse/node");
  return ParseNode;
});

import Parse from "parse/react-native";
Parse.initialize("microumbrella");
Parse.serverURL =
  process.env.NODE_ENV === "dev"
    ? "https://api-dev.microumbrella.com/parse"
    : "http://localhost:1337/parse";

const Purchase = Parse.Object.extend("Purchase");

import { saveNewPurchase } from "../src/parse/purchase";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("saves new accident purchase vanilla", () => {
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

  expect.assertions(3);

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
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
    })
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new accident purchase mr", () => {
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

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
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
    })
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new accident purchase vanilla", () => {
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

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
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
    })
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new travel purchase", () => {
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

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
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
    })
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseTravel");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new phone purchase", () => {
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

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
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
    })
    .then(res => {
      expect(res).toHaveProperty("className", "PurchasePhone");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => {
      console.error(err);
    });
});
