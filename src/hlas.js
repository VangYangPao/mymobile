// @flow
import uuidv4 from "uuid/v4";
import moment from "moment";

import {
  generateRef,
  verifyEnrolment,
  doFull3DSTransaction
} from "./telemoney";
import { objectToUrlParams } from "./utils";

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
  planid,
  policytermid,
  optionid,
  commencementDate
) {
  const source = AGENT_CODE;
  const paramStr = objectToUrlParams({
    planid,
    policytermid,
    optionid,
    commencementDate,
    source
  });
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

export function verifyApplicationAccident(WebAppID) {
  const tomorrow = moment(new Date()).add(1, "days");
  const tomorrowStr = tomorrow.format("YYYY-MM-DD");
  const payload = {
    Premium: 10,
    WebAppID,
    PolicyCommencementDate: tomorrowStr,
    PolicyHolder: {
      Surname: "sample string",
      GivenName: "sample string",
      IDNumber: generateNRIC(),
      IDNumberType: 0,
      DateOfBirth: "1988-07-27T18:06:55.8940692+08:00",
      GenderID: 2,
      MobileTelephone: "91234568",
      Email: "guanhao3797@gmail.com",
      UnitNumber: "sample string 10",
      BlockHouseNumber: "sample string 11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "089057"
    },
    AccidentDetails: {
      ProductPlanID: 100,
      OccupationID: 61,
      PolicyTermsID: 1,
      OptionsID: 1
    },
    PaymentInfo: {
      PaymentReferenceNumber: "sample string 1",
      NameOnCard: "sample string 2",
      CardNumber: "sample string 3",
      CardType: 0,
      CardSecurityCode: "sample string 4",
      CardExpiryYear: 5,
      CardExpiryMonth: 6,
      BankID: 7,
      BankName: "sample string 8",
      PayByApplicant: true,
      Surname: "sample string 9",
      GivenName: "sample string 10",
      IDNumber: "sample string 11",
      IDNumberType: 0,
      TelephoneNumber: "sample string 12",
      TelemoneyTransactionResponse: "sample string 13"
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/VerifyNewApplication`;
  return sendPOSTRequest(url, payload, "Error verifying accident application");
}

export function createPaymentTransactionAccident(WebAppID, PASAppID) {
  const tomorrow = moment(new Date()).add(1, "days");
  const tomorrowStr = tomorrow.format("YYYY-MM-DD");
  const payload = {
    Premium: 1.0,
    WebAppID,
    PASAppID,
    AutoRenew: true,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: 5,
    ReferralSource: "sample string 6",
    ProductPlanID: 7,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate: tomorrowStr,
    CoverageID: 12,
    CoverageName: "sample string 13",
    PolicyHolder: {
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      DateOfBirth: "1988-07-22",
      GenderID: 1,
      MobileTelephone: "91234567",
      Email: "guanhao3797@gmail.com",
      UnitNumber: "11",
      BlockHouseNumber: "11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "089057"
    },
    AccidentDetails: {
      ProductPlanID: 1,
      OccupationID: 2,
      PolicyTermsID: 3,
      OptionsID: 4
    },
    PlanPremium: 14.0,
    PersonalCoveragePremium: 15.0,
    TotalPremium: 16.0,
    FirstPremium: 17.0,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      NameOnCard: "Test test",
      CardNumber: "4005550000000001",
      CardType: 0,
      CardSecurityCode: "602",
      CardExpiryYear: 2021,
      CardExpiryMonth: 1,
      BankID: 143,
      PayByApplicant: true,
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: 0,
      TelephoneNumber: "91234567",

      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9"
      //Note: Telemoney Payment response result
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/CreatePaymentTransaction`;
  return sendPOSTRequest(
    url,
    payload,
    "Error creating payment transaction - Accident"
  );
}

export function updatePaymentTransactionAccident(WebAppID, PASAppID) {
  const tomorrow = moment(new Date()).add(1, "days");
  const tomorrowStr = tomorrow.format("YYYY-MM-DD");
  const payload = {
    Premium: 1.0,
    WebAppID,
    PASAppID,
    AutoRenew: true,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: 5,
    ReferralSource: "sample string 6",
    ProductPlanID: 7,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate: tomorrowStr,
    CoverageID: 12,
    CoverageName: "sample string 13",
    PolicyHolder: {
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      DateOfBirth: "1988-07-22",
      GenderID: 1,
      MobileTelephone: "91234567",
      Email: "guanhao3797@gmail.com",
      UnitNumber: "11",
      BlockHouseNumber: "11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "089057"
    },
    AccidentDetails: {
      ProductPlanID: 1,
      OccupationID: 2,
      PolicyTermsID: 3,
      OptionsID: 4
    },
    PlanPremium: 14.0,
    PersonalCoveragePremium: 15.0,
    TotalPremium: 16.0,
    FirstPremium: 17.0,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      NameOnCard: "Test test",
      CardNumber: "4005550000000001",
      CardType: 0,
      CardSecurityCode: "602",
      CardExpiryYear: 2021,
      CardExpiryMonth: 1,
      BankID: 143,
      PayByApplicant: true,
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: 0,
      TelephoneNumber: "91234567",

      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      //Note: Telemoney Payment response result
      paymentSuccessful: true
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/UpdatePaymentTransactionStatus`;
  return sendPOSTRequest(
    url,
    payload,
    "Error updating payment transaction status - Accident"
  );
}

export function submitApplicationAccident(WebAppID, PASAppID) {
  const tomorrow = moment(new Date()).add(1, "days");
  const tomorrowStr = tomorrow.format("YYYY-MM-DD");
  const payload = {
    Premium: 1.0,
    WebAppID,
    PASAppID,
    AutoRenew: true,
    MeetsRequirements: "sample string 4",
    ReferralSouceID: 5,
    ReferralSource: "sample string 6",
    ProductPlanID: 7,
    ProductPlanName: "sample string 8",
    PropertyTypeID: 9,
    PropertyTypeName: "sample string 10",
    InsuranceBackFromPayment: "sample string 11",
    PersonalCoverage: true,
    PolicyCommencementDate: tomorrowStr,
    CoverageID: 12,
    CoverageName: "sample string 13",
    PolicyHolder: {
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      DateOfBirth: "1988-07-22",
      GenderID: 1,
      MobileTelephone: "91234567",
      Email: "guanhao3797@gmail.com",
      UnitNumber: "11",
      BlockHouseNumber: "11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "089057"
    },
    AccidentDetails: {
      ProductPlanID: 1,
      OccupationID: 2,
      PolicyTermsID: 3,
      OptionsID: 4
    },
    PlanPremium: 14.0,
    PersonalCoveragePremium: 15.0,
    TotalPremium: 16.0,
    FirstPremium: 17.0,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      NameOnCard: "Test test",
      CardNumber: "4005550000000001",
      CardType: 0,
      CardSecurityCode: "602",
      CardExpiryYear: 2021,
      CardExpiryMonth: 1,
      BankID: 143,
      PayByApplicant: true,
      Surname: "test",
      GivenName: "test",
      IDNumber: "S0086294J",
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: 0,
      TelephoneNumber: "91234567",

      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      //Note: Telemoney Payment response result
      paymentSuccessful: true
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Accident/SubmitApplication`;
  return sendPOSTRequest(
    url,
    payload,
    "Error submitting application - Accident"
  );
}

type ProductPlanID = 1 | 2 | 84 | 85;

type PaymentDetails = {
  NameOnCard: string,
  CardNumber: string,
  CardType: 2 | 3,
  CardSecurityCode: string,
  CardExpiryYear: number,
  CardExpiryMonth: number
};

type PolicyHolder = {
  Surname: string,
  GivenName: string,
  IDNumber: string,
  IDNumberType: number,
  DateOfBirth: string,
  GenderID: number,
  MobileTelephone: string,
  Email: string,
  UnitNumber: string,
  BlockHouseNumber: string,
  BuildingName: string,
  StreetName: string,
  PostalCode: string
};

type Traveller = {
  Surname: string,
  GivenName: string,
  IDNumber: string,
  IDNumberType: number,
  DateOfBirth: string,
  GenderID: number,
  RelationshipID: number
};

function padStart(str, padString, length) {
  while (str.length < length) str = padString + str;
  return str;
}

export function purchaseTravelPolicy(
  premium: number,
  countryid: number,
  startDate: Date,
  endDate: Date,
  planid: ProductPlanID,
  hasSpouse: boolean,
  hasChildren: boolean,
  policyHolder: PolicyHolder,
  paymentDetails: PaymentDetails
) {
  const ref: string = generateRef();
  let PASAppID, args;
  const WebAppID: string = uuidv4();
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
      PASAppID = res.ApplciationNo;
      args = [
        WebAppID,
        PASAppID,
        premium,
        countryid,
        startDate,
        endDate,
        planid,
        policyHolder,
        paymentDetails
      ];
      return createPaymentTransactionTravelSingle(...args);
    })
    .then(res => {
      const year = paymentDetails.CardExpiryYear - 2000;
      const month = padStart(paymentDetails.CardExpiryMonth + "", "0", 2);
      const card = {
        ccnum: paymentDetails.CardNumber,
        ccdate: `${year}${month}`,
        cccvv: paymentDetails.CardSecurityCode,
        ccname: paymentDetails.NameOnCard
      };
      return doFull3DSTransaction(card, paymentDetails.CardType, premium);
    })
    .then(res => {
      return updatePaymentTransactionTravelSingle(...args);
    })
    .then(res => {
      return submitApplicationTravelSingle(...args);
    });
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
  WebAppID: string,
  PASAppID: string,
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
    InsuredTravellers,
    NetPremium: Premium,
    GrossPremium: Premium,
    PaymentInfo: {
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.MobileTelephone,

      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
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
  WebAppID: string,
  PASAppID: string,
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
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.IDNumberType,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      //Note: Telemoney Payment response result
      TelemoneyPaymentResultRow:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      // Note : result row from Telemoney
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
  WebAppID: string,
  PASAppID: string,
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
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
      // Note A stands for Application 8919 is the ID returned from successful verified, WDF26F6 unique sequence generated
      BankID: 143,
      PayByApplicant: true,
      Surname: PolicyHolder.Surname,
      GivenName: PolicyHolder.GivenName,
      IDNumber: PolicyHolder.IDNumber,
      // Note : Assumed always pay by applicant is true in the backend system
      IDNumberType: PolicyHolder.IDNumberType,
      TelephoneNumber: PolicyHolder.MobileTelephone,
      TelemoneyTransactionResponse:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      //Note: Telemoney Payment response result
      TelemoneyPaymentResultRow:
        "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      // Note : result row from Telemoney
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
