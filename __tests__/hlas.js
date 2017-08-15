import "react-native";
import "isomorphic-fetch";
import uuidv4 from "uuid/v4";
import {
  getTravelQuote,
  verifyApplicationTravelSingle,
  getAccidentQuote,
  getPhoneProtectQuote,
  verifyApplicationAccident,
  createPaymentTransactionTravelSingle,
  updatePaymentTransactionTravelSingle
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

// it("verifies accident application correctly", () => {
//   return verifyApplicationAccident().then(res => {
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

// it("verifies single travel application correctly", () => {
//   return verifyApplicationTravelSingle().then(res => {
//     console.log(res);
//   });
// });

// it("creates payment transaction for single travel correctly", () => {
//   expect.assertions(2);
//   const WebAppID = uuidv4();
//   return verifyApplicationTravelSingle(WebAppID)
//     .then(res => {
//       expect(typeof res.ApplciationNo).toBe("number");
//       return createPaymentTransactionTravelSingle(WebAppID, res.ApplciationNo);
//     })
//     .then(res => {
//       expect(res.Success).toBe(true);
//       console.log(res);
//     });
// });

it("updates payment transaction for single travel correctly", () => {
  expect.assertions(3);
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
      console.log(res);
      return expect(res.Success).toBe(true);
    });
});
