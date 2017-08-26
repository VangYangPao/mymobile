import uuidv4 from "uuid/v4";
import moment from "moment";

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

function generateNRIC() {
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
      if (!response.Success) {
        throw new Error(errorResponse + ": " + JSON.stringify(response));
      }
      return response;
    });
}

export function getPhoneProtectQuote() {
  const url = `${HLAS_URL}/api/Phone/GetPhoneProtectQuote`;
  return fetch(url).then(res => res.json()).catch(err => console.error(err));
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
      if (!response.Success) {
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

      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9"
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

      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
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

      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
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

export function getTravelQuote(
  countryid,
  tripDurationInDays,
  planid,
  hasSpouse,
  hasChildren
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
      if (!response.Success) {
        throw new Error("Error getting quote: " + JSON.stringify(response));
      }
      return response;
    });
}

export function verifyApplicationTravelSingle(WebAppID) {
  const today = new Date();
  const todayStr = moment(today).format("YYYY-MM-DD");
  const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const twoDaysLaterStr = moment(twoDaysLater).format("YYYY-MM-DD");
  const payload = {
    Premium: 10,
    WebAppID,
    AutoRenew: false,
    ReferralSouceID: 75,
    CountryID: 80,
    TravelStartDate: todayStr,
    TravelEndDate: twoDaysLaterStr,
    ProductPlanID: 1,
    CoverageID: 13,
    NumberOfChildren: 0,
    PolicyHolder: {
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
    },
    InsuredTravellers: [
      {
        Surname: "test",
        GivenName: "test",
        IDNumber: "S1799591B",
        IDNumberType: 0,
        DateOfBirth: "1988-07-22T16:06:27.4082335+08:00",
        GenderID: 1,
        RelationshipID: 4
      }
    ],
    PlanPremium: 14,
    PersonalCoveragePremium: 15,
    TotalPremium: 16,
    FirstPremium: 17,
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
  const url = `${HLAS_URL}/api/Travel/VerifyApp_TravelSingle`;
  return sendPOSTRequest(url, payload, "Error verifying travel application");
}

export function createPaymentTransactionTravelSingle(WebAppID, PASAppID) {
  const today = new Date();
  const todayStr = moment(today).format("YYYY-MM-DD");
  const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const twoDaysLaterStr = moment(twoDaysLater).format("YYYY-MM-DD");
  const payload = {
    WebAppID,
    CountryID: 86,
    TravelStartDate: todayStr,
    TravelEndDate: twoDaysLaterStr,
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
      Email: "guanhao3797@gmail.com",
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

      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9"
      //Note: Telemoney Payment response result
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/CreatePaymentTransaction`;
  return sendPOSTRequest(
    url,
    payload,
    "Error creating payment transaction - Travel"
  );
}

export function updatePaymentTransactionTravelSingle(WebAppID, PASAppID) {
  const payload = {
    WebAppID,
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
      Email: "guanhao3797@gmail.com",
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
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
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
      IDNumberType: 0,
      TelephoneNumber: "91234567",
      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      // Note : result row from Telemoney
      paymentSuccessful: true
      // Note: to update the payment status
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/UpdatePaymentTransactionStatus`;
  return sendPOSTRequest(
    url,
    payload,
    "Error updating payment transaction - Travel"
  );
}

export function submitApplicationTravelSingle(WebAppID, PASAppID) {
  const payload = {
    WebAppID,
    PASAppID,
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
      Email: "guanhao3797@gmail.com",
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
      PaymentReferenceNumber: `A${PASAppID}-WT1608170248`,
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
      TelemoneyTransactionResponse: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      TelemoneyPaymentResultRow: "TM_MCode=20151111011&TM_RefNo=WT1608170248&TM_TrnType=sale&TM_SubTrnType=&TM_Status=YES&TM_Error=&TM_Currency=SGD&TM_DebitAmt=11.00&TM_PaymentType=3&TM_BankRespCode=00&TM_ApprovalCode=878429&TM_ErrorMsg=&TM_UserField1=&TM_UserField2=&TM_UserField3=&TM_UserField4=&TM_UserField5=&TM_Original_RefNo=&TM_CCLast4Digit=0001&TM_RecurrentId=&TM_CCNum=xxxxxxxxxxxx0001&TM_ExpiryDate=2101&TM_IPP_FirstPayment=&TM_IPP_LastPayment=&TM_IPP_MonthlyPayment=&TM_IPP_TransTenure=&TM_IPP_TotalInterest=&TM_IPP_DownPayment=&TM_IPP_MonthlyInterest=&TM_OriginalPayType=3&TM_Version=2&TM_Signature=E5ADA760E8E251F8DBDDB8ADC8767949E694C6C6DC171558BA01F580D0900F8E12C72698991F86720AC2DC4AC39844FABA56FB3DCC47CD8371288B0D7750F9C9",
      paymentSuccessful: true
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/SubmitApplication_SingleTravel`;
  return sendPOSTRequest(
    url,
    payload,
    "Error in submitting application - Travel"
  );
}
