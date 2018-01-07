// @flow
import "react-native";
import Parse from "parse/react-native";

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
} from "../microumbrella-core/src/models/hlas";
import { saveNewPurchase } from "../microumbrella-core/src/parse/purchase";

import moment from "moment";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// it("gets phone protect quote correctly", () => {
//   expect.assertions(2);
//   return getPhoneProtectQuote().then(res => {
//     expect(res).toHaveProperty("data");
//     expect(res).toHaveProperty("success", true);
//   });
// });

// it("gets accident quote correctly", () => {
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 1;
//   const commencementDate = new Date();
//   expect.assertions(2);
//   return getAccidentQuote(
//     planid,
//     policytermid,
//     optionid,
//     commencementDate
//   ).then(res => {
//     expect(res).toHaveProperty("data");
//     expect(res).toHaveProperty("success", true);
//   });
// });

// it("gets travel quote correctly", () => {
//   const countryid = 1;
//   const tripDurationInDays = 2;
//   const planid = 1;
//   const hasSpouse = true;
//   const hasChildren = false;
//   expect.assertions(2);
//   return getTravelQuote(
//     countryid,
//     tripDurationInDays,
//     planid,
//     hasSpouse,
//     hasChildren
//   ).then(res => {
//     expect(res).toHaveProperty("data");
//     expect(res).toHaveProperty("success", true);
//   });
// });

it("purchases phone protect correctly", () => {
  const premium = 115;
  const PHONE_PRODUCT_PLAN_ID = 99;
  const PHONE_PRODUCT_OPTION_ID = 1;
  const idNumberType = 1;
  const nric = generateNRIC();
  const policyHolder: PolicyHolder = {
    Surname: "test",
    GivenName: "test",
    IDNumber: nric,
    IDNumberType: idNumberType,
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
  const paymentDetails: PaymentDetails = {
    NameOnCard: "Chan",
    CardNumber: "4005550000000001",
    CardType: 3,
    CardSecurityCode: "602",
    CardExpiryYear: 2021,
    CardExpiryMonth: 1
  };
  const mobileDetails = {
    brandID: 1,
    modelID: 5,
    purchaseDate: "2017-11-24",
    serialNo: "989753317723690",
    purchasePlaceID: 4
  };
  const policyCommencementDate = new Date();
  expect.assertions(18);
  return purchasePhonePolicy(
    premium,
    policyCommencementDate,
    mobileDetails,
    policyHolder,
    paymentDetails
  ).then(res => {
    expect(res.success).toBe(true);
    expect(res.data.policyId).toMatch(/^PM/);
    expect(res.data.premium).toBe(premium);
    expect(res.data.planId).toBe(PHONE_PRODUCT_PLAN_ID);
    expect(res.data.autoRenew).toBe(true);
    expect(res.data.policyholderIdType).toBe(idNumberType);
    expect(res.data.policyholderIdNo).toBe(nric);
    expect(res.data.optionId).toBe(PHONE_PRODUCT_OPTION_ID);
    expect(res.data.tmTxnRef).toMatch(/^WT\d+/);
    expect(res.data.tmVerifyEnrolment).toMatch(/^TM_MCode=/);
    expect(res.data.tmPaymentSuccessRes).toMatch(/^TM_MCode=/);
    expect(res.data).toHaveProperty("additionalAttributes");
    expect(res.data.additionalAttributes).toHaveProperty("commencementDate");
    expect(res.data.additionalAttributes).toHaveProperty(
      "serialNo",
      mobileDetails.serialNo
    );
    expect(res.data.additionalAttributes).toHaveProperty(
      "brandId",
      mobileDetails.brandID
    );
    expect(res.data.additionalAttributes).toHaveProperty(
      "modelId",
      mobileDetails.modelID
    );
    expect(res.data.additionalAttributes).toHaveProperty(
      "purchasePlaceId",
      mobileDetails.purchasePlaceID
    );
    expect(res.data.additionalAttributes).toHaveProperty(
      "commencementDate",
      moment(policyCommencementDate).format("YYYY-MM-DD")
    );
  });
});

// it("purchases pa vanilla correctly", () => {
//   const premium = 17;
//   const planid = 100;
//   const policytermid = 1;
//   const optionid = 0;
//   const occupationid = 2;
//   const nric = generateNRIC();
//   const idNumberType = 1;
//   const tomorrow = moment(new Date())
//     .add(1, "days")
//     .toDate();

//   const policyHolder: PolicyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: nric,
//     IDNumberType: idNumberType,
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
//   expect.assertions(15);

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
//       const purchaseHLASResponse = res;
//       expect(res.success).toBe(true);
//       expect(res.data.policyId).toMatch(/^AM/);
//       expect(res.data.premium).toBe(premium);
//       expect(res.data.planId).toBe(planid);
//       expect(res.data.optionId).toBe(optionid);
//       expect(res.data.autoRenew).toBe(true);
//       expect(res.data.policyholderIdType).toBe(idNumberType);
//       expect(res.data.policyholderIdNo).toBe(nric);
//       expect(res.data.tmTxnRef).toMatch(/^WT\d+/);
//       expect(res.data.tmVerifyEnrolment).toMatch(/^TM_MCode=/);
//       expect(res.data.tmPaymentSuccessRes).toMatch(/^TM_MCode=/);
//       expect(res.data).toHaveProperty("additionalAttributes");
//       expect(res.data.additionalAttributes).toHaveProperty("commencementDate");
//       expect(res.data.additionalAttributes).toHaveProperty(
//         "occupationId",
//         occupationid
//       );
//       expect(res.data.additionalAttributes).toHaveProperty(
//         "policyTermsId",
//         policytermid
//       );
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
//       expect(res.data.policyId).toMatch(/^AM/);
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
//       expect(res.data.policyId).toMatch(/^AM/);
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
//   const nric = generateNRIC();
//   let purchaseHLASResponse;
//   const policyHolder = {
//     Surname: "test",
//     GivenName: "test",
//     IDNumber: nric,
//     IDNumberType: 1,
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
//   const transformToHLAS = traveller => ({
//     Surname: traveller.lastName,
//     GivenName: traveller.firstName,
//     IDNumber: traveller.idNumber,
//     DateOfBirth: traveller.DOB,
//     GenderID: traveller.gender,
//     RelationshipID: traveller.relationship
//   });
//   expect.assertions(17);
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
//       purchaseHLASResponse = res;
//       expect(res.success).toBe(true);
//       expect(res.data.policyId).toMatch(/^TR/);
//       expect(res.data.premium).toBe(15);
//       expect(res.data.planId).toBe(1);
//       expect(res.data.optionId).toBe(13);
//       expect(res.data.autoRenew).toBe(true);
//       expect(res.data.policyholderIdType).toBe(1);
//       expect(res.data.policyholderIdNo).toBe(nric);
//       expect(res.data.tmTxnRef).toMatch(/^WT\d+/);
//       expect(res.data.tmVerifyEnrolment).toMatch(/^TM_MCode=/);
//       expect(res.data.tmPaymentSuccessRes).toMatch(/^TM_MCode=/);
//       expect(res.data).toHaveProperty("additionalAttributes");
//       expect(res.data.additionalAttributes.spouse).toMatchObject(
//         transformToHLAS(travellers[0])
//       );
//       expect(res.data.additionalAttributes.children).toEqual(
//         expect.arrayContaining([transformToHLAS(travellers[1])])
//       );
//       expect(res.data.additionalAttributes.startDate).toBe(startDate);
//       expect(res.data.additionalAttributes.endDate).toBe(endDate);
//       expect(res.data.additionalAttributes.countryId).toBe(countryid);
//       const {
//         policyTypeId,
//         pasAppId,
//         policyId,
//         webAppId,
//         premium,
//         planId,
//         optionId,
//         autoRenew,
//         policyholderIdType,
//         policyholderIdNo,
//         tmTxnRef,
//         tmVerifyEnrolment,
//         tmPaymentSuccessRes,
//         additionalAttributes
//       } = purchaseHLASResponse.data;
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });
