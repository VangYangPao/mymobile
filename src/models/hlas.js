// @flow
import uuidv4 from "uuid/v4";
import moment from "moment";

import type {
  TravelProductPlanID,
  AccidentProductPlanID,
  AccidentOptionID,
  AccidentPolicyTermID,
  PaymentDetails,
  PolicyHolder,
  Traveller,
  AccidentDetails,
  OccupationID,
  MobileDetails,
  MUTraveller
} from "../types/hlas";
import {
  generateRef,
  verifyEnrolment,
  doFull3DSTransaction
} from "./telemoney";
import { objectToUrlParams, retry } from "../utils";

const HLAS_URL = "http://42.61.99.229:8080";
const AGENT_CODE = "MIC00002"; // just to track microassurce account
const AGENT_WCC = "MIC"; // // just to track the sale from microassurance . please use “MIC” – should be the same in the production.
const REFERRAL_SOURCE_ID = 75;
const OPT_IN_HLAS_MKTG = false; //To indicate customer has opt in/opt out the marketing or promotional info from  HL Assurance.
const PHONE_PRODUCT_PLAN_ID = 99;
const PHONE_COVERAGE_ID = 3;

const postHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

function generateRandomNumberFromRange(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export function generateNRIC() {
  let numbers = "";
  for (let i = 0; i < 7; i++) {
    numbers += "" + generateRandomNumberFromRange(1, 10);
  }
  return "S" + numbers + "C";
}

function sendPOSTRequest(url, payload, errorResponse) {
  return fetch(url, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(payload)
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      if (!response.success) {
        throw new Error(errorResponse + ": " + JSON.stringify(response));
      }
      return response;
    });
}

export function getPhoneProtectQuote() {
  const url = `${HLAS_URL}/api/Phone/GetPhoneProtectQuote`;
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err));
}

export function purchasePhonePolicy(
  premium: number,
  policyCommencementDate: Date,
  mobileDetails: MobileDetails,
  policyHolder: any,
  paymentDetails: PaymentDetails,
  extractPaRes: Function
) {
  let PASAppID,
    verifyEnrolmentResponseObj,
    verifyEnrolmentResponse,
    paymentSuccessfulResponse;
  const transactionRef: string = generateRef();
  const telemoneyCard = paymentDetailsToTelemoneyCard(paymentDetails);
  const webAppID: string = uuidv4();
  let commencementDate: string = moment(policyCommencementDate).format(
    "YYYY-MM-DD"
  );
  return verifyApplicationPhone(
    webAppID,
    premium,
    commencementDate,
    mobileDetails,
    policyHolder,
    paymentDetails
  )
    .then(res => {
      PASAppID = res.applciationNo;
      console.log("verified application", PASAppID);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return verifyEnrolment(
          transactionRef,
          telemoneyCard,
          paymentDetails.CardType,
          premium.toFixed(2)
        );
      });
    })
    .then(res => {
      verifyEnrolmentResponseObj = res;
      verifyEnrolmentResponse = objectToUrlParams(verifyEnrolmentResponseObj);
      return createPaymentTransactionPhone(
        transactionRef,
        webAppID,
        PASAppID,
        premium,
        commencementDate,
        mobileDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse
      );
    })
    .then(res => {
      // const args = [
      //   card,
      //   paymentDetails.CardType,
      //   premium,
      //   verifyEnrolmentResponseObj
      // ];
      // return retryPromise(doFull3DSTransaction, args, 5, 2000);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return doFull3DSTransaction(
          telemoneyCard,
          paymentDetails.CardType,
          premium,
          verifyEnrolmentResponseObj,
          extractPaRes
        );
      });
    })
    .then(res => {
      console.log("payment res", res);
      paymentSuccessfulResponse = objectToUrlParams(res);
      return updatePaymentTransactionPhone(
        transactionRef,
        webAppID,
        PASAppID,
        premium,
        commencementDate,
        mobileDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    })
    .then(res => {
      return submitApplicationPhone(
        transactionRef,
        webAppID,
        PASAppID,
        premium,
        commencementDate,
        mobileDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    });
}

export function verifyApplicationPhone(
  webAppID: string,
  premium: number,
  policyCommencementDate: string,
  mobileDetails: MobileDetails,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails
) {
  // const payload = {
  //   webAppID: uuidv4(),
  //   premium,
  //   productPlanID: PHONE_PRODUCT_PLAN_ID,
  //   policyCommencementDate,
  //   policyHolder,
  //   mobileDetails,
  //   paymentInfo,
  //   optIn: OPT_IN_HLAS_MKTG,
  //   ipAddress: "sample string 15"
  // };
  const payload = {
    webAppID,
    premium,
    productPlanID: PHONE_PRODUCT_PLAN_ID,
    policyCommencementDate,
    policyHolder,
    mobileDetails,
    paymentInfo: {
      paymentReferenceNumber: "sample string 1",
      bankID: 7,
      bankName: "sample string 8",
      payByApplicant: true,
      surname: "sample string 9",
      givenName: "sample string 10",
      idNumber: "sample string 11",
      idNumberType: 0,
      telephoneNumber: "sample string 12",
      telemoneyTransactionResponse: "sample string 13",
      telemoneyPaymentResultRow: "sample string 14",
      paymentSuccessful: true,
      ...paymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    ipAddress: "sample string 15"
  };
  console.log(payload);
  const url = `${HLAS_URL}/api/Phone/VerifyNewApplication`;
  return sendPOSTRequest(
    url,
    payload,
    "Error verifying phone protect application"
  );
}

export function createPaymentTransactionPhone(
  transactionRef: string,
  webAppID: string,
  pasAppID: string,
  premium: number,
  policyCommencementDate: string,
  mobileDetails: MobileDetails,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails,
  telemoneyTransactionResponse: string
) {
  const payload = {
    webAppID,
    pasAppID,
    premium,
    productPlanID: PHONE_PRODUCT_PLAN_ID,
    policyCommencementDate,
    policyHolder,
    mobileDetails,
    PaymentInfo: {
      PaymentReferenceNumber: `A${pasAppID}-${transactionRef}`,
      BankID: 143,
      PayByApplicant: true,
      Surname: policyHolder.Surname,
      GivenName: policyHolder.GivenName,
      IDNumber: policyHolder.IDNumber,
      TelephoneNumber: policyHolder.TelephoneNumber,
      telemoneyTransactionResponse,
      ...paymentDetails
    },
    OptIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Phone/CreatePaymentTransaction`;
  return sendPOSTRequest(
    url,
    payload,
    "Error creating payment transaction phone protect"
  );
}

export function updatePaymentTransactionPhone(
  transactionRef: string,
  webAppID: string,
  pasAppID: string,
  premium: number,
  policyCommencementDate: string,
  mobileDetails: MobileDetails,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  const payload = {
    webAppID,
    pasAppID,
    premium,
    productPlanID: PHONE_PRODUCT_PLAN_ID,
    policyCommencementDate,
    policyHolder,
    mobileDetails,
    PaymentInfo: {
      PaymentReferenceNumber: `A${pasAppID}-${transactionRef}`,
      BankID: 143,
      PayByApplicant: true,
      Surname: policyHolder.Surname,
      GivenName: policyHolder.GivenName,
      IDNumber: policyHolder.IDNumber,
      TelephoneNumber: policyHolder.TelephoneNumber,
      TelemoneyTransactionResponse,
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...paymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    ipAddress: "sample string 15"
  };
  console.log(payload);
  const url = `${HLAS_URL}/api/Phone/UpdatePaymentTransactionStatus`;
  return sendPOSTRequest(
    url,
    payload,
    "Error updating payment transaction phone protect"
  );
}

export function submitApplicationPhone(
  transactionRef: string,
  webAppID: string,
  pasAppID: string,
  premium: number,
  policyCommencementDate: string,
  mobileDetails: MobileDetails,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  const payload = {
    webAppID,
    pasAppID,
    premium,
    productPlanID: PHONE_PRODUCT_PLAN_ID,
    policyCommencementDate,
    policyHolder,
    mobileDetails,
    PaymentInfo: {
      PaymentReferenceNumber: `A${pasAppID}-${transactionRef}`,
      BankID: 143,
      PayByApplicant: true,
      Surname: policyHolder.Surname,
      GivenName: policyHolder.GivenName,
      IDNumber: policyHolder.IDNumber,
      TelephoneNumber: policyHolder.TelephoneNumber,
      TelemoneyTransactionResponse,
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...paymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    ipAddress: "sample string 15"
  };
  const url = `${HLAS_URL}/api/Phone/SubmitApplication`;
  return sendPOSTRequest(
    url,
    payload,
    "Error submit application phone protect"
  ).then(res => {
    const { success, policyNo } = res;
    const { brandID, modelID, serialNo, purchasePlaceID } = mobileDetails;
    return {
      success,
      data: {
        policyTypeId: "mobile",
        pasAppId: pasAppID,
        policyId: policyNo,
        webAppId: webAppID,
        premium,
        planId: PHONE_PRODUCT_PLAN_ID,
        optionId: 1,
        autoRenew: false,
        policyholderIdType: policyHolder.IDNumberType,
        policyholderIdNo: policyHolder.IDNumber,
        tmTxnRef: transactionRef,
        tmVerifyEnrolment: TelemoneyTransactionResponse,
        tmPaymentSuccessRes: TelemoneyPaymentResultRow,
        additionalAttributes: {
          brandId: brandID,
          modelId: modelID,
          serialNo,
          purchasePlaceId: purchasePlaceID,
          commencementDate: policyCommencementDate,
          purchaseDate: moment(mobileDetails.purchaseDate).toDate()
        }
      }
    };
  });
}

export function getAccidentQuote(
  planid: AccidentProductPlanID,
  policytermid: AccidentPolicyTermID,
  optionid: AccidentOptionID,
  commencementDate: Date
) {
  commencementDate = moment(commencementDate).format("YYYY-MM-DD");
  const source = AGENT_CODE;
  let payload: {
    planid: AccidentProductPlanID,
    policytermid: AccidentPolicyTermID,
    commencementDate: string,
    source: string,
    optionid: AccidentOptionID
  } = {
    planid,
    policytermid,
    commencementDate,
    source,
    optionid
  };
  const paramStr = objectToUrlParams(payload);
  const path = "api/Accident/GetQuoteAccident";
  const url = `${HLAS_URL}/${path}?${paramStr}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
    .then(response => {
      // console.log(response.headers);
      // console.log(response.status);
      return response.json();
    })
    .then(response => {
      if (!response.success) {
        throw new Error(
          "Error getting accident quote: " + JSON.stringify(response)
        );
      }
      return response;
    });
}

function paymentDetailsToTelemoneyCard(form) {
  const year = form.CardExpiryYear - 2000;
  const month = padStart(form.CardExpiryMonth + "", "0", 2);
  return {
    ccnum: form.CardNumber,
    ccdate: `${year}${month}`,
    cccvv: form.CardSecurityCode,
    ccname: form.NameOnCard
  };
}

export function purchaseAccidentPolicy(
  premium: number,
  planid: AccidentProductPlanID,
  policytermid: AccidentPolicyTermID,
  optionid: AccidentOptionID,
  occupationid: OccupationID,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails,
  extractPaRes: Function
) {
  let PASAppID,
    verifyEnrolmentResponseObj,
    verifyEnrolmentResponse,
    paymentSuccessfulResponse;
  const transactionRef: string = generateRef();
  const WebAppID: string = uuidv4();
  const telemoneyCard = paymentDetailsToTelemoneyCard(paymentDetails);
  const tomorrow = moment(new Date()).add(1, "days");
  const commencementDate = tomorrow.format("YYYY-MM-DD");

  const accidentDetails = {
    ProductPlanID: planid,
    OccupationID: occupationid,
    PolicyTermsID: policytermid,
    OptionsID: optionid
  };
  return verifyApplicationAccident(
    WebAppID,
    premium,
    commencementDate,
    accidentDetails,
    policyHolder,
    paymentDetails
  )
    .then(res => {
      PASAppID = res.applciationNo;
      console.log("verified application", PASAppID);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return verifyEnrolment(
          transactionRef,
          telemoneyCard,
          paymentDetails.CardType,
          premium.toFixed(2)
        );
      });
    })
    .then(res => {
      verifyEnrolmentResponseObj = res;
      verifyEnrolmentResponse = objectToUrlParams(verifyEnrolmentResponseObj);
      return createPaymentTransactionAccident(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        commencementDate,
        accidentDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse
      );
    })
    .then(res => {
      // const args = [
      //   card,
      //   paymentDetails.CardType,
      //   premium,
      //   verifyEnrolmentResponseObj
      // ];
      // return retryPromise(doFull3DSTransaction, args, 5, 2000);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return doFull3DSTransaction(
          telemoneyCard,
          paymentDetails.CardType,
          premium,
          verifyEnrolmentResponseObj,
          extractPaRes
        );
      });
    })
    .then(res => {
      console.log("payment res", res);
      paymentSuccessfulResponse = objectToUrlParams(res);
      return updatePaymentTransactionAccident(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        commencementDate,
        accidentDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    })
    .then(res => {
      return submitApplicationAccident(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        commencementDate,
        accidentDetails,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    });
}

export function verifyApplicationAccident(
  WebAppID: string,
  Premium: number,
  PolicyCommencementDate: string,
  AccidentDetails: AccidentDetails,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails
) {
  const payload = {
    Premium,
    WebAppID,
    PolicyCommencementDate,
    PolicyHolder,
    AccidentDetails,
    PaymentInfo: {
      PaymentReferenceNumber: "sample string 1",
      BankID: 143,
      BankName: "sample string 8",
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      IDNumberType: 0,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      TelemoneyTransactionResponse: "sample string 13",
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/VerifyNewApplication`;
  console.log(payload);
  return sendPOSTRequest(url, payload, "Error verifying accident application");
}

export function createPaymentTransactionAccident(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  PolicyCommencementDate: string,
  AccidentDetails: AccidentDetails,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string
) {
  const payload = {
    Premium,
    WebAppID,
    PASAppID,
    AutoRenew: false,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: REFERRAL_SOURCE_ID,
    ReferralSource: "MicroUmbrella",
    ProductPlanID: AccidentDetails.ProductPlanID,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate,
    CoverageID: AccidentDetails.OptionsID,
    CoverageName: "sample string 13",
    PolicyHolder,
    AccidentDetails,
    PlanPremium: Premium,
    PersonalCoveragePremium: Premium,
    TotalPremium: Premium,
    FirstPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      IDNumberType: 0,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      //Note: Telemoney Payment response result
      TelemoneyTransactionResponse,
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/CreatePaymentTransaction`;
  return sendPOSTRequest(
    url,
    payload,
    "Error creating payment transaction - Accident"
  );
}

export function updatePaymentTransactionAccident(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  PolicyCommencementDate: string,
  AccidentDetails: AccidentDetails,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  const payload = {
    Premium,
    WebAppID,
    PASAppID,
    AutoRenew: false,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: REFERRAL_SOURCE_ID,
    ReferralSource: "MicroUmbrella",
    ProductPlanID: AccidentDetails.ProductPlanID,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate,
    CoverageID: AccidentDetails.OptionsID,
    CoverageName: "sample string 13",
    PolicyHolder,
    AccidentDetails,
    PlanPremium: Premium,
    PersonalCoveragePremium: Premium,
    TotalPremium: Premium,
    FirstPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      IDNumberType: 0,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      //Note: Telemoney Payment response result
      TelemoneyTransactionResponse,
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/UpdatePaymentTransactionStatus`;
  return sendPOSTRequest(
    url,
    payload,
    "Error updating payment transaction status - Accident"
  );
}

export function submitApplicationAccident(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  PolicyCommencementDate: string,
  AccidentDetails: AccidentDetails,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  const payload = {
    Premium,
    WebAppID,
    PASAppID,
    AutoRenew: false,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: REFERRAL_SOURCE_ID,
    ReferralSource: "MicroUmbrella",
    ProductPlanID: AccidentDetails.ProductPlanID,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate,
    CoverageID: AccidentDetails.OptionsID,
    CoverageName: "sample string 13",
    PolicyHolder,
    AccidentDetails,
    PlanPremium: Premium,
    PersonalCoveragePremium: Premium,
    TotalPremium: Premium,
    FirstPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      IDNumberType: 0,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      //Note: Telemoney Payment response result
      TelemoneyTransactionResponse,
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/SubmitApplication`;
  return sendPOSTRequest(
    url,
    payload,
    "Error submitting application - Accident"
  ).then(res => {
    const { success, policyNo } = res;
    const {
      ProductPlanID,
      PolicyTermsID,
      OptionsID,
      OccupationID
    } = AccidentDetails;
    const commencementDate = moment(PolicyCommencementDate).toDate();
    return {
      success,
      data: {
        policyTypeId: "pa",
        pasAppId: PASAppID,
        policyId: policyNo,
        webAppId: WebAppID,
        premium: Premium,
        planId: ProductPlanID,
        optionId: OptionsID,
        autoRenew: false,
        policyholderIdType: PolicyHolder.IDNumberType,
        policyholderIdNo: PolicyHolder.IDNumber,
        tmTxnRef: transactionRef,
        tmVerifyEnrolment: TelemoneyTransactionResponse,
        tmPaymentSuccessRes: TelemoneyPaymentResultRow,
        additionalAttributes: {
          commencementDate,
          occupationId: OccupationID,
          policyTermsId: PolicyTermsID
        }
      }
    };
  });
}

function padStart(str, padString, length) {
  while (str.length < length) str = padString + str;
  return str;
}

function transformToHLASTravellers(traveller: MUTraveller): Traveller {
  return {
    Surname: traveller.lastName,
    GivenName: traveller.firstName,
    IDNumber: traveller.idNumber,
    DateOfBirth: traveller.DOB,
    GenderID: traveller.gender,
    RelationshipID: traveller.relationship
  };
}

export function purchaseTravelPolicy(
  premium: number,
  countryid: number,
  startDate: Date,
  endDate: Date,
  planid: TravelProductPlanID,
  travellers: Array<MUTraveller>,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails,
  extractPaRes: Function
) {
  console.log(
    premium,
    countryid,
    startDate,
    endDate,
    planid,
    travellers,
    policyHolder,
    paymentDetails
  );
  let PASAppID,
    args,
    verifyEnrolmentResponseObj,
    verifyEnrolmentResponse,
    paymentSuccessfulResponse;
  const transactionRef: string = generateRef();
  const WebAppID: string = uuidv4();
  const year = paymentDetails.CardExpiryYear - 2000;
  const month = padStart(paymentDetails.CardExpiryMonth + "", "0", 2);
  const card = {
    ccnum: paymentDetails.CardNumber,
    ccdate: `${year}${month}`,
    cccvv: paymentDetails.CardSecurityCode,
    ccname: paymentDetails.NameOnCard
  };
  travellers = travellers.map(transformToHLASTravellers);
  return verifyApplicationTravelSingle(
    WebAppID,
    premium,
    countryid,
    startDate,
    endDate,
    planid,
    travellers,
    policyHolder,
    paymentDetails
  )
    .then(res => {
      PASAppID = res.applciationNo;
      console.log("verified application", PASAppID);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return verifyEnrolment(
          transactionRef,
          card,
          paymentDetails.CardType,
          premium.toFixed(2)
        );
      });
    })
    .then(res => {
      verifyEnrolmentResponseObj = res;
      verifyEnrolmentResponse = objectToUrlParams(verifyEnrolmentResponseObj);
      return createPaymentTransactionTravelSingle(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        countryid,
        startDate,
        endDate,
        planid,
        travellers,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse
      );
    })
    .then(res => {
      // const args = [
      //   card,
      //   paymentDetails.CardType,
      //   premium,
      //   verifyEnrolmentResponseObj
      // ];
      // return retryPromise(doFull3DSTransaction, args, 5, 2000);
      let count = 0;
      return retry(5, () => {
        console.log("retry", ++count);
        return doFull3DSTransaction(
          card,
          paymentDetails.CardType,
          premium,
          verifyEnrolmentResponseObj,
          extractPaRes
        );
      });
    })
    .then(res => {
      console.log("payment res", res);
      paymentSuccessfulResponse = objectToUrlParams(res);
      console.log("payment successful", res);
      return updatePaymentTransactionTravelSingle(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        countryid,
        startDate,
        endDate,
        planid,
        travellers,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    })
    .then(res => {
      console.log("update payment transaction", res);
      return submitApplicationTravelSingle(
        transactionRef,
        WebAppID,
        PASAppID,
        premium,
        countryid,
        startDate,
        endDate,
        planid,
        travellers,
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    });
}

export function getTravelQuote(
  countryid: number,
  tripDurationInDays: number,
  planid: TravelProductPlanID,
  hasSpouse: boolean,
  hasChildren: boolean
) {
  const paramStr = objectToUrlParams({
    countryid,
    tripDurationInDays,
    planid,
    hasSpouse,
    hasChildren,
    source: AGENT_CODE
  });
  const path = "api/Travel/GetQuoteSingleTravel";
  const url = `${HLAS_URL}/${path}?${paramStr}`;
  console.log(url);
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
    .then(response => {
      // console.log(response.headers);
      // console.log(response.status);
      return response.json();
    })
    .then(response => {
      if (!response.success) {
        throw new Error("Error getting quote: " + JSON.stringify(response));
      }
      return response;
    });
}

export function verifyApplicationTravelSingle(
  WebAppID: string,
  Premium: number,
  CountryID: number,
  TravelStartDate: Date,
  TravelEndDate: Date,
  ProductPlanID: TravelProductPlanID,
  InsuredTravellers: Array<Traveller>,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails
) {
  TravelStartDate = moment(TravelStartDate).format("YYYY-MM-DD");
  TravelEndDate = moment(TravelEndDate).format("YYYY-MM-DD");
  const applicantTraveller = {
    Surname: PolicyHolder.Surname,
    GivenName: PolicyHolder.GivenName,
    IDNumber: PolicyHolder.IDNumber,
    IDNumberType: PolicyHolder.IDNumberType,
    DateOfBirth: PolicyHolder.DateOfBirth,
    GenderID: PolicyHolder.GenderID,
    RelationshipID: 4
  };
  const payload = {
    Premium,
    WebAppID,
    AutoRenew: false,
    ReferralSouceID: REFERRAL_SOURCE_ID,
    CountryID: 80,
    TravelStartDate,
    TravelEndDate,
    ProductPlanID,
    CoverageID: 13,
    NumberOfChildren: 0,
    PolicyHolder,
    InsuredTravellers,
    PlanPremium: Premium,
    PersonalCoveragePremium: Premium,
    TotalPremium: Premium,
    FirstPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: "sample string 1",
      BankID: 7,
      BankName: "sample string 8",
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      IDNumberType: PolicyHolder.IDNumberType,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      TelemoneyTransactionResponse: "sample string 13",
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  console.log(payload);
  const url = `${HLAS_URL}/api/Travel/VerifyApp_TravelSingle`;
  return sendPOSTRequest(url, payload, "Error verifying travel application");
}

export function createPaymentTransactionTravelSingle(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  CountryID: number,
  TravelStartDate: Date,
  TravelEndDate: Date,
  ProductPlanID: TravelProductPlanID,
  InsuredTravellers: Array<Traveller>,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string
) {
  TravelStartDate = moment(TravelStartDate).format("YYYY-MM-DD");
  TravelEndDate = moment(TravelEndDate).format("YYYY-MM-DD");
  const applicantTraveller: Traveller = {
    Surname: PolicyHolder.Surname,
    GivenName: PolicyHolder.GivenName,
    IDNumber: PolicyHolder.IDNumber,
    IDNumberType: PolicyHolder.IDNumberType,
    DateOfBirth: PolicyHolder.DateOfBirth,
    GenderID: PolicyHolder.GenderID,
    RelationshipID: 4
  };
  const payload = {
    Premium,
    WebAppID,
    AutoRenew: false,
    ReferralSouceID: REFERRAL_SOURCE_ID,
    CountryID: 80,
    TravelStartDate,
    TravelEndDate,
    ProductPlanID,
    CoverageID: 13,
    NumberOfChildren: 0,
    PolicyHolder,
    InsuredTravellers,
    NetPremium: Premium,
    GrossPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.MobileTelephone,
      TelemoneyTransactionResponse,
      //Note: Telemoney Payment response result
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/CreatePaymentTransaction`;
  return sendPOSTRequest(
    url,
    payload,
    "Error creating payment transaction - Travel"
  );
}

export function updatePaymentTransactionTravelSingle(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  CountryID: number,
  TravelStartDate: Date,
  TravelEndDate: Date,
  ProductPlanID: TravelProductPlanID,
  InsuredTravellers: Array<Traveller>,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  TravelStartDate = moment(TravelStartDate).format("YYYY-MM-DD");
  TravelEndDate = moment(TravelEndDate).format("YYYY-MM-DD");
  const applicantTraveller = {
    Surname: PolicyHolder.Surname,
    GivenName: PolicyHolder.GivenName,
    IDNumber: PolicyHolder.IDNumber,
    IDNumberType: PolicyHolder.IDNumberType,
    DateOfBirth: PolicyHolder.DateOfBirth,
    GenderID: PolicyHolder.GenderID,
    RelationshipID: 4
  };
  const payload = {
    WebAppID,
    CurrentStep: 0,
    CountryID,
    TravelStartDate,
    TravelEndDate,
    ProductPlanID,
    CoverageID: 13,
    NumberOfChildren: 0,
    PolicyHolder,
    InsuredTravellers,
    NetPremium: Premium,
    GrossPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.IDNumberType,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      //Note: Telemoney Payment response result
      TelemoneyTransactionResponse,
      // Note : result row from Telemoney
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  console.log(payload);
  const url = `${HLAS_URL}/api/Travel/UpdatePaymentTransactionStatus`;
  return sendPOSTRequest(
    url,
    payload,
    "Error updating payment transaction - Travel"
  );
}

export function submitApplicationTravelSingle(
  transactionRef: string,
  WebAppID: string,
  PASAppID: string,
  Premium: number,
  CountryID: number,
  TravelStartDate: Date,
  TravelEndDate: Date,
  ProductPlanID: TravelProductPlanID,
  InsuredTravellers: Array<Traveller>,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string,
  TelemoneyPaymentResultRow: string
) {
  const _TravelStartDate = TravelStartDate;
  const _TravelEndDate = TravelEndDate;
  TravelStartDate = moment(TravelStartDate).format("YYYY-MM-DD");
  TravelEndDate = moment(TravelEndDate).format("YYYY-MM-DD");
  const applicantTraveller = {
    Surname: PolicyHolder.Surname,
    GivenName: PolicyHolder.GivenName,
    IDNumber: PolicyHolder.IDNumber,
    IDNumberType: PolicyHolder.IDNumberType,
    DateOfBirth: PolicyHolder.DateOfBirth,
    GenderID: PolicyHolder.GenderID,
    RelationshipID: 4
  };
  const payload = {
    WebAppID,
    PASAppID,
    CurrentStep: 0,
    CountryID,
    TravelStartDate,
    TravelEndDate,
    ProductPlanID,
    CoverageID: 13,
    NumberOfChildren: 0,
    PolicyHolder,
    InsuredTravellers,
    NetPremium: Premium,
    GrossPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-${transactionRef}`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.IDNumberType,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      //Note: Telemoney Payment response result
      TelemoneyTransactionResponse,
      // Note : result row from Telemoney
      TelemoneyPaymentResultRow,
      paymentSuccessful: true,
      ...PaymentDetails
    },
    optIn: OPT_IN_HLAS_MKTG,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/SubmitApplication_SingleTravel`;
  return sendPOSTRequest(
    url,
    payload,
    "Error in submitting application - Travel"
  ).then(res => {
    const { success, policyNo } = res;
    const spouse =
      InsuredTravellers.find(traveller => traveller.RelationshipID === 1) ||
      null;
    const children = InsuredTravellers.filter(
      traveller => traveller.RelationshipID === 2
    );
    return {
      success,
      data: {
        policyTypeId: "travel",
        pasAppId: PASAppID,
        policyId: policyNo,
        webAppId: WebAppID,
        premium: Premium,
        planId: ProductPlanID,
        optionId: 13,
        autoRenew: false,
        policyholderIdType: PolicyHolder.IDNumberType,
        policyholderIdNo: PolicyHolder.IDNumber,
        tmTxnRef: transactionRef,
        tmVerifyEnrolment: TelemoneyTransactionResponse,
        tmPaymentSuccessRes: TelemoneyPaymentResultRow,
        additionalAttributes: {
          spouse,
          children,
          countryId: CountryID,
          startDate: _TravelStartDate,
          endDate: _TravelEndDate
        }
      }
    };
  });
}
