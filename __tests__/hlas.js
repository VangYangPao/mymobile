import "react-native";
import "isomorphic-fetch";
import {
  getTravelQuote,
  verifyApplicationTravelSingle,
  submitApplicationTravelSingle,
  getAccidentQuote,
  getPhoneProtectQuote,
  verifyApplicationAccident
} from "../src/hlas";

const API_SOURCE = "mu-test";

it("gets phone protect quote correctly", () => {
  return getPhoneProtectQuote().then(res => {
    console.log(res);
  });
});

it("gets accident quote correctly", () => {
  const planid = 100;
  const policytermid = 1;
  const optionid = 1;
  const commencementDate = new Date().toISOString();
  return getAccidentQuote(
    planid,
    policytermid,
    optionid,
    commencementDate
  ).then(res => {
    console.log(res);
  });
});

it("verifies accident application correctly", () => {
  return verifyApplicationAccident().then(res => {
    console.log(res);
  });
});

it("gets travel quote correctly", () => {
  const countryid = 8;
  const tripDurationInDays = 2;
  const planid = 1;
  const hasSpouse = true;
  const hasChildren = false;
  return getTravelQuote(
    countryid,
    tripDurationInDays,
    planid,
    hasSpouse,
    hasChildren
  ).then(res => {
    console.log(res);
  });
});

it("verifies single travel application correctly", () => {
  return verifyApplicationTravelSingle().then(res => {
    console.log(res);
  });
});
