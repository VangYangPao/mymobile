import "react-native";
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
  submitApplicationTravelSingle
} from "../src/hlas";
import { create3dsAuthorizationRequest } from "../src/telemoney";

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
      expect(typeof res.ApplciationNo).toBe("number");
      expect(res.Success).toBe(true);
      PASAppID = res.ApplciationNo;
      return createPaymentTransactionAccident(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.Success).toBe(true);
      return updatePaymentTransactionAccident(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.Success).toBe(true);
      return submitApplicationAccident(WebAppID, PASAppID);
    })
    .then(res => {
      console.log(res);
      expect(res.Success).toBe(true);
      expect(typeof res.PolicyNo).toBe("string");
      expect(res.PolicyNo).toMatch(/^AM/);
    });
});

it("submits application for single travel correctly", () => {
  expect.assertions = 6;
  let PASAppID;
  const WebAppID = uuidv4();
  return verifyApplicationTravelSingle(WebAppID)
    .then(res => {
      expect(typeof res.ApplciationNo).toBe("number");
      PASAppID = res.ApplciationNo;
      return createPaymentTransactionTravelSingle(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.Success).toBe(true);
      return updatePaymentTransactionTravelSingle(WebAppID, PASAppID);
    })
    .then(res => {
      expect(res.Success).toBe(true);
      return submitApplicationTravelSingle(WebAppID, PASAppID);
    })
    .then(res => {
      console.log(res);
      expect(res.Success).toBe(true);
      expect(typeof res.PolicyNo).toBe("string");
      expect(res.PolicyNo).toMatch(/^TR/);
    });
});
