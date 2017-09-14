// @flow
import "react-native";
import "isomorphic-form-data";
import "isomorphic-fetch";
import uuidv4 from "uuid/v4";
import {
  getPhoneProtectQuote,
  getAccidentQuote,
  verifyApplicationAccident,
  createPaymentTransactionAccident,
  updatePaymentTransactionAccident,
  submitApplicationAccident,
  getTravelQuote,
  verifyApplicationTravelSingle,
  createPaymentTransactionTravelSingle,
  updatePaymentTransactionTravelSingle,
  submitApplicationTravelSingle,
  purchaseTravelPolicy,
  generateNRIC
} from "../src/hlas";
import { verifyEnrolment, doFull3DSTransaction } from "../src/telemoney";

import moment from "moment";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// it("gets phone protect quote correctly", () => {
//   return getPhoneProtectQuote().then(res => {
//     console.log(res);
//   });
// });

// it("gets accident quote correctly", () => {
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 1;
//   const commencementDate = new Date().toISOString();
//   return getAccidentQuote(
//     planid,
//     policytermid,
//     optionid,
//     commencementDate
//   ).then(res => {
//     console.log(res);
//   });
// });

// it("gets travel quote correctly", () => {
//   const countryid = 8;
//   const tripDurationInDays = 2;
//   const planid = 1;
//   const hasSpouse = true;
//   const hasChildren = false;
//   return getTravelQuote(
//     countryid,
//     tripDurationInDays,
//     planid,
//     hasSpouse,
//     hasChildren
//   ).then(res => {
//     console.log(res);
//   });
// });

it("submits application for accident correctly", () => {
  expect.assertions = 7;
  let PASAppID;
  const WebAppID = uuidv4();
  return verifyApplicationAccident(WebAppID)
    .then(res => {
      expect(typeof res.applciationNo).toBe("number");
      expect(res.success).toBe(true);
      PASAppID = res.applciationNo;
      return createPaymentTransactionAccident(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.success).toBe(true);
      return updatePaymentTransactionAccident(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.success).toBe(true);
      return submitApplicationAccident(WebAppID, PASAppID);
    })
    .then(res => {
      console.log(res);
      expect(res.success).toBe(true);
      expect(typeof res.policyNo).toBe("string");
      expect(res.policyNo).toMatch(/^AM/);
    });
});

it("purchases single travel correctly", () => {
  const premium = 15;
  const countryid = 8;
  const startDate = new Date();
  const endDate = moment(new Date())
    .add(2, "days")
    .toDate();
  const planid = 1;
  const hasSpouse = true;
  const hasChildren = true;
  const policyHolder = {
    Surname: "test",
    GivenName: "test",
    IDNumber: generateNRIC(),
    DateOfBirth: "1988-07-22",
    GenderID: 1,
    MobileTelephone: "91234567",
    Email: "guanhao3797@gmail.com",
    UnitNumber: "11",
    BlockHouseNumber: "11",
    BuildingName: "sample string 12",
    StreetName: "sample string 13",
    PostalCode: "089057"
  };
  const paymentDetails = {
    NameOnCard: "Chan",
    CardNumber: "4005550000000001",
    CardType: 3,
    CardSecurityCode: "602",
    CardExpiryYear: 2021,
    CardExpiryMonth: 1
  };

  return purchaseTravelPolicy(
    premium,
    countryid,
    startDate,
    endDate,
    planid,
    hasSpouse,
    hasChildren,
    policyHolder,
    paymentDetails
  )
    .then(res => {
      console.log("purchase successful", res);
    })
    .catch(err => {
      console.error(err);
    });
});

// it("submits application for single travel correctly", () => {
//   expect.assertions = 6;
//   let PASAppID;
//   const WebAppID = uuidv4();
//   return verifyApplicationTravelSingle(WebAppID).then(res => {
//     expect(typeof res.ApplciationNo).toBe("number");
//     PASAppID = res.ApplciationNo;
//     console.log(res);
//     return createPaymentTransactionTravelSingle(WebAppID, PASAppID);
//   });
//   .then(res => {
//     expect(res.Success).toBe(true);
//     return updatePaymentTransactionTravelSingle(WebAppID, PASAppID);
//   })
//   .then(res => {
//     expect(res.Success).toBe(true);
//     return submitApplicationTravelSingle(WebAppID, PASAppID);
//   })
//   .then(res => {
//     console.log(res);
//     expect(res.Success).toBe(true);
//     expect(typeof res.PolicyNo).toBe("string");
//     expect(res.PolicyNo).toMatch(/^TR/);
//   });
// });
