import { objectToUrlParams } from "./utils";

const HLAS_URL = "http://42.61.99.229:8080";

const postHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

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
    TravelStartDate: "2017-08-06T23:06:38.0591306+08:00",
    TravelEndDate: "2017-08-06T23:06:38.0591306+08:00",
    ProductPlanID: 11,
    ProductPlanName: "sample string 12",
    CoverageID: 13,
    CoverageName: "sample string 14",
    NumberOfChildren: 15,
    PolicyHolder: {
      Surname: "sample string 1",
      GivenName: "sample string 2",
      IDNumber: "sample string 3",
      IDNumberType: 0,
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
      GenderID: 4,
      GenderName: "sample string 5",
      HomeTelephone: "sample string 6",
      OfficeTelephone: "sample string 7",
      MobileTelephone: "sample string 8",
      Email: "sample string 9",
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
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
      DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
        DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
        DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
        DateOfBirth: "2017-08-06T23:06:38.0746866+08:00",
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
