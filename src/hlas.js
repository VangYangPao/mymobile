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
  OccupationID
} from "./types/hlas";
import {
  generateRef,
  verifyEnrolment,
  doFull3DSTransaction
} from "./telemoney";
import { objectToUrlParams, retryPromise, retry } from "./utils";

const HLAS_URL = "http://42.61.99.229:8080";
const AGENT_CODE = "MIC00002"; // just to track microassurce account
const AGENT_WCC = "MIC"; // // just to track the sale from microassurance . please use “MIC” – should be the same in the production.
const REFERRAL_SOURCE_ID = 75;
const OPT_IN_HLAS_MKTG = false; //To indicate customer has opt in/opt out the marketing or promotional info from  HL Assurance.

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
    optionid?: AccidentOptionID
  } = {
    planid,
    policytermid,
    commencementDate,
    source
  };
  if (optionid !== 0) {
    payload.optionid = optionid;
  }
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
  paymentDetails: PaymentDetails
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
      console.log("verified application");
      PASAppID = res.applciationNo;
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
          verifyEnrolmentResponseObj
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
    OptIn: false,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/VerifyNewApplication`;
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
    OptIn: false,
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
    OptIn: false,
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
    OptIn: false,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/SubmitApplication`;
  return sendPOSTRequest(
    url,
    payload,
    "Error submitting application - Accident"
  );
}

function padStart(str, padString, length) {
  while (str.length < length) str = padString + str;
  return str;
}

export function purchaseTravelPolicy(
  premium: number,
  countryid: number,
  startDate: Date,
  endDate: Date,
  planid: TravelProductPlanID,
  hasSpouse: boolean,
  hasChildren: boolean,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails
) {
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
  return verifyApplicationTravelSingle(
    WebAppID,
    premium,
    countryid,
    startDate,
    endDate,
    planid,
    policyHolder,
    paymentDetails
  )
    .then(res => {
      console.log("verified application");
      PASAppID = res.ApplciationNo;
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
          verifyEnrolmentResponseObj
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
        policyHolder,
        paymentDetails,
        verifyEnrolmentResponse,
        paymentSuccessfulResponse
      );
    });
  // .then(res => {
  //   console.log("update payment transaction", res);
  //   return submitApplicationTravelSingle(
  //     transactionRef,
  //     WebAppID,
  //     PASAppID,
  //     premium,
  //     countryid,
  //     startDate,
  //     endDate,
  //     planid,
  //     policyHolder,
  //     paymentDetails,
  //     verifyEnrolmentResponse,
  //     paymentSuccessfulResponse
  //   );
  // });
}

export function getTravelQuote(
  countryid: string,
  tripDurationInDays: number,
  planid: ProductPlanID,
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
  ProductPlanID: ProductPlanID,
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
  const InsuredTravellers: Array<Traveller> = [applicantTraveller];
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
    InsuredTravellers: InsuredTravellers,
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
    OptIn: false,
    IPAddress: "sample string 18"
  };
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
  ProductPlanID: ProductPlanID,
  PolicyHolder: PolicyHolder,
  PaymentDetails: PaymentDetails,
  TelemoneyTransactionResponse: string
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
  const InsuredTravellers: Array<Traveller> = [applicantTraveller];
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
    OptIn: false,
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
  ProductPlanID: ProductPlanID,
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
  const InsuredTravellers: Array<Traveller> = [applicantTraveller];
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
    OptIn: false,
    IPAddress: "sample string 18"
  };
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
  ProductPlanID: ProductPlanID,
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
  const InsuredTravellers: Array<Traveller> = [applicantTraveller];
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
    OptIn: false,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/SubmitApplication_SingleTravel`;
  return sendPOSTRequest(
    url,
    payload,
    "Error in submitting application - Travel"
  );
}

const payload = {
  WebAppID: "abcd123",
  //Note : Application ID that stored in the backend system in order to issue the policies
  PASAppID: 8920,
  CurrentStep: 0,
  CountryID: 86,
  TravelStartDate: "2017-07-30",
  TravelEndDate: "2017-08-04",
  ProductPlanID: 1,
  CoverageID: 13,
  NumberOfChildren: 0,
  PolicyHolder: {
    Surname: "test",
    GivenName: "test",
    IDNumber: "S0086294J",
    DateOfBirth: "1988-07-22",
    GenderID: 1,
    MobileTelephone: "91234567",
    Email: "ayethet.san@hlas.com.sg",
    UnitNumber: "11",
    BlockHouseNumber: "11",
    BuildingName: "sample string 12",
    StreetName: "sample string 13",
    PostalCode: "089057"
  },
  InsuredTravellers: [
    {
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      IDNumberType: 0,
      DateOfBirth: "1988-07-22T16:06:27.4082335+08:00",
      GenderID: 1,
      RelationshipID: 4
    }
  ],
  NetPremium: 16.0,
  GrossPremium: 17.0,
  PaymentInfo: {
    PaymentReferenceNumber: "A8919-WDF26F6",
    NameOnCard: "Test test",
    CardNumber: "4005550000000001",
    CardType: 0,
    CardSecurityCode: "602",
    CardExpiryYear: 2018,
    CardExpiryMonth: 8,
    BankID: 143,

    PayByApplicant: true,
    Surname: "test",
    GivenName: "test",
    IDNumber: "S0086294J",
    IDNumberType: 0,
    TelephoneNumber: "91234567",
    TelemoneyTransactionResponse:
      "TM_MCode=102201435770&TM_RefNo=A211417-WDF26F6&TM_TrnType=sale&TM_SubTrnType=&TM_Status=RDR&TM_Error=&TM_Currency=SGD&TM_DebitAmt=43.50&TM_PaymentType=2&TM_BankRespCode=&TM_ApprovalCode=&TM_ErrorMsg=&TM_TermUrl=https://securepayments.telemoneyworld.com/easypay2/telemoneyMpiStatus.do?TMInfo=b75e9e02db0450d7574a2aa41d6675c4e0524b5450990750f841335cb40ef53708245a819fee2092258374012e908700bfb83503caf4841f110ba7ca5f2ab443f36fce31e1d929cdfd10f12457db4281c235a0dc7cedc06e7102c55f5142e146&MD=12442896&VerStatus=Y&Acsurl=https://3dsecure.maybank.com.sg/PAReq.do?issuer_id=MBBSG_MasterCard&PaReq=eJxVUtluwjAQ/JWID8BHbrRYSgEJpCbiaD/AdSySKBdxgoCvrw2k0Led2bVnd3bhK+ukXB6kGDrJIJZK8aO08nQ+2UZ7ecKE2NQnhFCKqTdhcGcZnGWn8qZmZIqnFNAI9QedyHjdM+Di9LFJmOtQHISAnhAq2W2WjHiBjzEmFLs+oAcHNa8kW39a0eHwvY+SxQrQnQLRDHXfXZmPtdQIYOhKlvV9O0OobAQvs0b1swAHGJ1zxe20anOkBiH0SNNCtYDMA0CvDreDiZQWuOQpi5fRJblFdlyIS3xbOXFxvCbFzolvuzkgUwEp7yWjmPjYp75F7BkJZjQAdOeBV6Yz5tgu1uM+ALRGI3rPvDOgXe9kLcbRRgTy0ja11BWa/YshlUqwpOmt6Mzzkv+UUmsbDtBrlsXaeC967SgN3TD0qRc4xHO0MZ5Zwz1jBHJtIsWGfAJA5i16bhg9b0FH/27kF0iltuo=&TM_UserField1=Nita bte shaari&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=49f32793-ce44-4838-8798-a78555687031&TM_Original_RefNo=&TM_CCLast4Digit=9101&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx9101&TM_ExpiryDate=2006&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=&TM_Signature=",
    TelemoneyPaymentResultRow:
      "TM_MCode=102201435770&TM_RefNo=A211417-WDF26F6&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=43.50&TM_PaymentType=2&TM_BankRespCode=&TM_ApprovalCode=&TM_ErrorMsg=&TM_TermUrl=https://securepayments.telemoneyworld.com/easypay2/telemoneyMpiStatus.do?TMInfo=b75e9e02db0450d7574a2aa41d6675c4e0524b5450990750f841335cb40ef53708245a819fee2092258374012e908700bfb83503caf4841f110ba7ca5f2ab443f36fce31e1d929cdfd10f12457db4281c235a0dc7cedc06e7102c55f5142e146&MD=12442896&VerStatus=Y&Acsurl=https://3dsecure.maybank.com.sg/PAReq.do?issuer_id=MBBSG_MasterCard&PaReq=eJxVUtluwjAQ/JWID8BHbrRYSgEJpCbiaD/AdSySKBdxgoCvrw2k0Led2bVnd3bhK+ukXB6kGDrJIJZK8aO08nQ+2UZ7ecKE2NQnhFCKqTdhcGcZnGWn8qZmZIqnFNAI9QedyHjdM+Di9LFJmOtQHISAnhAq2W2WjHiBjzEmFLs+oAcHNa8kW39a0eHwvY+SxQrQnQLRDHXfXZmPtdQIYOhKlvV9O0OobAQvs0b1swAHGJ1zxe20anOkBiH0SNNCtYDMA0CvDreDiZQWuOQpi5fRJblFdlyIS3xbOXFxvCbFzolvuzkgUwEp7yWjmPjYp75F7BkJZjQAdOeBV6Yz5tgu1uM+ALRGI3rPvDOgXe9kLcbRRgTy0ja11BWa/YshlUqwpOmt6Mzzkv+UUmsbDtBrlsXaeC967SgN3TD0qRc4xHO0MZ5Zwz1jBHJtIsWGfAJA5i16bhg9b0FH/27kF0iltuo=&TM_UserField1=Nita bte shaari&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=49f32793-ce44-4838-8798-a78555687031&TM_Original_RefNo=&TM_CCLast4Digit=9101&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx9101&TM_ExpiryDate=2006&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=&TM_Signature=",
    paymentSuccessful: true
  },
  OptIn: true,
  IPAddress: "sample string 18"
};
