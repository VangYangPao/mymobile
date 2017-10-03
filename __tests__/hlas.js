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
  generateNRIC,
  purchaseAccidentPolicy,
  purchasePhonePolicy
} from "../src/hlas";
import { verifyEnrolment, doFull3DSTransaction } from "../src/telemoney";
import type { PolicyHolder, PaymentDetails } from "../src/types/hlas";

import moment from "moment";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

it("gets phone protect quote correctly", () => {
  expect.assertions(2);
  return getPhoneProtectQuote().then(res => {
    expect(res).toHaveProperty("data");
    expect(res).toHaveProperty("success", true);
  });
});

it("gets accident quote correctly", () => {
  const planid = 100;
  const policytermid = 1;
  const optionid = 1;
  const commencementDate = new Date();
  expect.assertions(2);
  return getAccidentQuote(
    planid,
    policytermid,
    optionid,
    commencementDate
  ).then(res => {
    expect(res).toHaveProperty("data");
    expect(res).toHaveProperty("success", true);
  });
});

it("gets travel quote correctly", () => {
  const countryid = 1;
  const tripDurationInDays = 2;
  const planid = 1;
  const hasSpouse = true;
  const hasChildren = false;
  expect.assertions(2);
  return getTravelQuote(
    countryid,
    tripDurationInDays,
    planid,
    hasSpouse,
    hasChildren
  ).then(res => {
    expect(res).toHaveProperty("data");
    expect(res).toHaveProperty("success", true);
  });
});

// it("purchases phone protect correctly", () => {
//   const premium = 5;
//   const policyHolder: PolicyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: generateNRIC(),
//     DateOfBirth: "1988-07-22",
//     GenderID: 1,
//     MobileTelephone: "91234567",
//     Email: "guanhao3797@gmail.com",
//     UnitNumber: "11",
//     BlockHouseNumber: "11",
//     BuildingName: "sample string 12",
//     StreetName: "sample string 13",
//     PostalCode: "089057"
//   };
//   const paymentDetails: PaymentDetails = {
//     NameOnCard: "Chan",
//     CardNumber: "4005550000000001",
//     CardType: 3,
//     CardSecurityCode: "602",
//     CardExpiryYear: 2021,
//     CardExpiryMonth: 1
//   };
//   const mobileDetails = {
//     brandID: 1,
//     modelID: 5,
//     purchaseDate: "2017-09-16",
//     serialNo: "989753317723690",
//     purchasePlaceID: 4
//   };
//   const policyCommencementDate = new Date();
//   expect.assertions(2);
//   return purchasePhonePolicy(
//     premium,
//     policyCommencementDate,
//     mobileDetails,
//     policyHolder,
//     paymentDetails
//   ).then(res => {
//     expect(res.success).toBe(true);
//     expect(res.policyNo).toMatch(/^PM/);
//   });
// });

// it("purchases pa vanilla correctly", () => {
//   const premium = 17;
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 0;
//   const occupationid = 2;

//   const policyHolder: PolicyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: generateNRIC(),
//     DateOfBirth: "1988-07-22",
//     GenderID: 1,
//     MobileTelephone: "91234567",
//     Email: "guanhao3797@gmail.com",
//     UnitNumber: "11",
//     BlockHouseNumber: "11",
//     BuildingName: "sample string 12",
//     StreetName: "sample string 13",
//     PostalCode: "089057"
//   };
//   const paymentDetails: PaymentDetails = {
//     NameOnCard: "Chan",
//     CardNumber: "4005550000000001",
//     CardType: 3,
//     CardSecurityCode: "602",
//     CardExpiryYear: 2021,
//     CardExpiryMonth: 1
//   };
//   expect.assertions(2);

//   return purchaseAccidentPolicy(
//     premium,
//     planid,
//     policytermid,
//     optionid,
//     occupationid,
//     policyHolder,
//     paymentDetails
//   )
//     .then(res => {
//       expect(res.success).toBe(true);
//       expect(res.policyNo).toMatch(/^AM/);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// it("purchases pa with mr correctly", () => {
//   const premium = 17;
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 1;
//   const occupationid = 2;

//   const policyHolder: PolicyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: generateNRIC(),
//     DateOfBirth: "1988-07-22",
//     GenderID: 1,
//     MobileTelephone: "91234567",
//     Email: "guanhao3797@gmail.com",
//     UnitNumber: "11",
//     BlockHouseNumber: "11",
//     BuildingName: "sample string 12",
//     StreetName: "sample string 13",
//     PostalCode: "089057"
//   };
//   const paymentDetails: PaymentDetails = {
//     NameOnCard: "Chan",
//     CardNumber: "4005550000000001",
//     CardType: 3,
//     CardSecurityCode: "602",
//     CardExpiryYear: 2021,
//     CardExpiryMonth: 1
//   };
//   expect.assertions(2);

//   return purchaseAccidentPolicy(
//     premium,
//     planid,
//     policytermid,
//     optionid,
//     occupationid,
//     policyHolder,
//     paymentDetails
//   )
//     .then(res => {
//       expect(res.success).toBe(true);
//       expect(res.policyNo).toMatch(/^AM/);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// it("purchases pa with wi correctly", () => {
//   const premium = 17;
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 2;
//   const occupationid = 2;

//   const policyHolder: PolicyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: generateNRIC(),
//     DateOfBirth: "1988-07-22",
//     GenderID: 1,
//     MobileTelephone: "91234567",
//     Email: "guanhao3797@gmail.com",
//     UnitNumber: "11",
//     BlockHouseNumber: "11",
//     BuildingName: "sample string 12",
//     StreetName: "sample string 13",
//     PostalCode: "089057"
//   };
//   const paymentDetails: PaymentDetails = {
//     NameOnCard: "Chan",
//     CardNumber: "4005550000000001",
//     CardType: 3,
//     CardSecurityCode: "602",
//     CardExpiryYear: 2021,
//     CardExpiryMonth: 1
//   };
//   expect.assertions(2);
//   return purchaseAccidentPolicy(
//     premium,
//     planid,
//     policytermid,
//     optionid,
//     occupationid,
//     policyHolder,
//     paymentDetails
//   )
//     .then(res => {
//       expect(res.success).toBe(true);
//       expect(res.policyNo).toMatch(/^AM/);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// it("purchases single travel correctly", () => {
//   const premium = 15;
//   const countryid = 8;
//   const startDate = new Date();
//   const endDate = moment(new Date())
//     .add(2, "days")
//     .toDate();
//   const planid = 1;
//   const hasSpouse = true;
//   const hasChildren = true;
//   const policyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: generateNRIC(),
//     DateOfBirth: "1988-07-22",
//     GenderID: 1,
//     MobileTelephone: "91234567",
//     Email: "guanhao3797@gmail.com",
//     UnitNumber: "11",
//     BlockHouseNumber: "11",
//     BuildingName: "sample string 12",
//     StreetName: "sample string 13",
//     PostalCode: "089057"
//   };
//   const paymentDetails = {
//     NameOnCard: "Chan",
//     CardNumber: "4005550000000001",
//     CardType: 3,
//     CardSecurityCode: "602",
//     CardExpiryYear: 2021,
//     CardExpiryMonth: 1
//   };
//   const travellers = [
//     {
//       lastName: "Chan",
//       firstName: "Hao",
//       idNumber: "123",
//       DOB: "2007-08-09",
//       gender: 1,
//       relationship: 1
//     },
//     {
//       lastName: "Chan",
//       firstName: "Hao",
//       idNumber: "124",
//       DOB: "2007-08-01",
//       gender: 2,
//       relationship: 2
//     }
//   ];
//   expect.assertions(2);
//   return purchaseTravelPolicy(
//     premium,
//     countryid,
//     startDate,
//     endDate,
//     planid,
//     travellers,
//     policyHolder,
//     paymentDetails
//   )
//     .then(res => {
//       expect(res.success).toBe(true);
//       expect(res.policyNo).toMatch(/^TR/);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });
