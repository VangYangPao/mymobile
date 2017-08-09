import "react-native";
import "isomorphic-fetch";
import {
  getTravelQuote,
  verifyApplicationTravelSingle,
  submitApplicationTravelSingle,
  getAccidentQuote,
  getPhoneProtectQuote
} from "../src/hlas";

const API_SOURCE = "mu-test";

// it("gets phone protect quote correctly", () => {
//   getPhoneProtectQuote().then(res => {
//     console.log(res);
//     done();
//   });
// });

// it("gets accident quote correctly", () => {
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 1;
//   const commencementDate = new Date().toISOString();
//   const source = API_SOURCE;
//   getAccidentQuote(
//     planid,
//     policytermid,
//     optionid,
//     commencementDate,
//     source
//   ).then(res => {
//     console.log(res);
//     done();
//   });
// });

it("gets travel quote correctly", () => {
  const countryid = 8;
  const tripDurationInDays = 2;
  const planid = 1;
  const hasSpouse = true;
  const hasChildren = false;
  const source = API_SOURCE;
  getTravelQuote(
    countryid,
    tripDurationInDays,
    planid,
    hasSpouse,
    hasChildren,
    source
  ).then(res => {
    console.log(res);
  });
});

it("verifies single travel application correctly", done => {
  verifyApplicationTravelSingle().then(res => {
    console.log(res);
    done();
  });
});

// it("submits single travel application correctly", () => {
//   submitApplicationTravelSingle().then(res => {
//     console.log(res);
//     done();
//   });
// });
