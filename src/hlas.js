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

export function getPhoneProtectQuote() {
  const url = `${HLAS_URL}/api/Phone/GetPhoneProtectQuote`;
  return fetch(url).then(res => res.json()).catch(err => console.error(err));
}

export function getAccidentQuote(
  planid,
  policytermid,
  optionid,
  commencementDate,
  source
) {
  const paramStr = objectToUrlParams({
    planid,
    policytermid,
    optionid,
    commencementDate,
    source
  });
  const path = "api/Accident/GetQuoteAccident";
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
      if (!response.Success) {
        throw new Error("Error getting quote");
      }
      return response;
    })
    .catch(error => console.error(error));
}

export function getTravelQuote(
  countryid,
  tripDurationInDays,
  planid,
  hasSpouse,
  hasChildren,
  source
) {
  const paramStr = objectToUrlParams({
    countryid,
    tripDurationInDays,
    planid,
    hasSpouse,
    hasChildren,
    source
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
        throw new Error("Error getting quote");
      }
      return response;
    })
    .catch(error => console.error(error));
}

export function verifyApplicationTravelSingle() {
  const WebAppID = uuidv4();
  const today = new Date();
  const todayStr = moment(today).format("YYYY-MM-DD");
  const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const twoDaysLaterStr = moment(twoDaysLater).format("YYYY-MM-DD");
  const now = new Date();
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
      IDNumber: "S1799591B",
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
  return fetch(url, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.error(error));
}

export function submitApplicationTravelSingle() {
  const payload = {
    WebAppID: "sample string 1",
    PASAppID: 2,
    CurrentStep: 0,
    CountryID: 3,
    CountryName: "sample string 4",
    AgentCode: "sample string 5",
    AgentWCC: "sample string 6",
    AreaID: 7,
    AreaName: "sample string 8",
    ReferralSouceID: 9,
    ReferralSource: "sample string 10",
    TravelStartDate: "2017-08-06T23:13:30.0439212+08:00",
    TravelEndDate: "2017-08-06T23:13:30.0439212+08:00",
    ProductPlanID: 1,
    ProductPlanName: "sample string 12",
    CoverageID: 13,
    CoverageName: "sample string 14",
    NumberOfChildren: 15,
    PolicyHolder: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      HomeTelephone: "sample string 6",
      OfficeTelephone: "sample string 7",
      MobileTelephone: "sample string 8",
      Email: "guanhao3797@gmail.com",
      UnitNumber: "sample string 10",
      BlockHouseNumber: "sample string 11",
      BuildingName: "sample string 12",
      StreetName: "sample string 13",
      PostalCode: "sample string 14"
    },
    InsuredPersons_Spouse: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      RelationshipID: 6,
      RelationshipName: "sample string 7"
    },
    InsuredPersons_child1: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      RelationshipID: 6,
      RelationshipName: "sample string 7"
    },
    InsuredPersons_child2: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      RelationshipID: 6,
      RelationshipName: "sample string 7"
    },
    InsuredPersons_child3: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      RelationshipID: 6,
      RelationshipName: "sample string 7"
    },
    InsuredPersons_child4: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      RelationshipID: 6,
      RelationshipName: "sample string 7"
    },
    InsuredTravellers: [
      {
        Surname: "sample string 1",
        GivenName: "sample string 2",
        IDNumber: "sample string 3",
        IDNumberType: 0,
        DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
        GenderID: 4,
        GenderName: "sample string 5",
        RelationshipID: 6,
        RelationshipName: "sample string 7",
        DisplayControlID: "sample string 8"
      },
      {
        Surname: "sample string 1",
        GivenName: "sample string 2",
        IDNumber: "sample string 3",
        IDNumberType: 0,
        DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
        GenderID: 4,
        GenderName: "sample string 5",
        RelationshipID: 6,
        RelationshipName: "sample string 7",
        DisplayControlID: "sample string 8"
      },
      {
        Surname: "sample string 1",
        GivenName: "sample string 2",
        IDNumber: "sample string 3",
        IDNumberType: 0,
        DateOfBirth: "2017-08-06T23:13:30.0439212+08:00",
        GenderID: 4,
        GenderName: "sample string 5",
        RelationshipID: 6,
        RelationshipName: "sample string 7",
        DisplayControlID: "sample string 8"
      }
    ],
    NetPremium: 16.0,
    GrossPremium: 17.0,
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
      TelemoneyTransactionResponse: "sample string 13",
      TelemoneyPaymentResultRow: "sample string 14",
      paymentSuccessful: true
    },
    OptIn: true,
    IPAddress: "sample string 18"
  };
  const url = `${HLAS_URL}/api/Travel/SubmitApplication_SingleTravel`;
  return fetch(url, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(payload)
  })
    .then(response => {
      return response.json();
    })
    .catch(error => console.error(error));
}
