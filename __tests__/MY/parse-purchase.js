// @flow
import "./mocks.my";
import Parse from "parse/react-native";
import type {
  Policyholder,
  PersonalDetailsType
} from "../../types/MY/policies";
import type {
  PlanNameType,
  PlanDurationNameType
} from "../../data/MY/pa-prices";
import {
  purchaseTravelPolicy,
  purchasePAPolicy
} from "../../src/MY/parse/purchase";
import { calculatePAPolicyExpiry } from "../../src/MY/parse/utils";
import moment from "moment";

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

const USER_EMAIL = "hello@microumbrella.com";
const USER_PASSWORD = "1234abcd";

const Purchase = Parse.Object.extend("Purchase");

function cleanupPurchase(purchase: Purchase) {
  return purchase.destroy({ useMasterKey: true });
}

function validateTravelPurchase(
  purchase,
  user: Parse.User,
  premium: number,
  planType: string,
  isOneWayTrip: boolean,
  travelStartDate: Date,
  travelEndDate: Date,
  travelArea: string,
  webcashReturnCode: string,
  webcashMercRef: string,
  travellers: Array<Policyholder>
) {
  expect(purchase.get("premium")).toEqual(premium);
  expect(purchase.get("planType")).toEqual(planType);
  expect(purchase.get("tripType")).toEqual("SGRT");
  expect(purchase.get("commencementDate")).toEqual(travelStartDate);
  expect(purchase.get("expiryDate")).toEqual(travelEndDate);
  expect(purchase.get("travelArea")).toEqual(travelArea);
  expect(purchase.get("webcashReturnCode")).toEqual(webcashReturnCode);
  expect(purchase.get("webcashMercRef")).toEqual(webcashMercRef);

  const policyholder: Policyholder = travellers.find(traveller => {
    return traveller.travellerType === "IWB";
  });
  expect(user.get("idNumber")).toEqual(policyholder.idNumber);
  expect(user.get("idNumberType")).toEqual(policyholder.idNumberType);
  expect(user.get("DOB")).toEqual(policyholder.DOB);
  expect(user.get("mobilePhone")).toEqual(policyholder.mobilePhone);
  expect(user.get("housePhone")).toEqual(policyholder.housePhone);
  expect(user.get("officePhone")).toEqual(policyholder.officePhone);
  expect(user.get("salutation")).toEqual(policyholder.salutation);
  expect(user.get("gender")).toEqual(policyholder.gender);
  expect(user.get("maritalStatus")).toEqual(policyholder.maritalStatus);
  expect(user.get("race")).toEqual(policyholder.race);
  expect(user.get("religion")).toEqual(policyholder.religion);
  expect(user.get("nationality")).toEqual(policyholder.nationality);
  expect(user.get("designation")).toEqual(policyholder.designation);
  expect(user.get("address1")).toEqual(policyholder.address1);
  expect(user.get("address2")).toEqual(policyholder.address2);
  expect(user.get("postcode")).toEqual(policyholder.postcode);
  expect(user.get("state")).toEqual(policyholder.state);

  return purchase;
}

it("should purchase travel correctly", () => {
  const premium = 17;
  const planType = "1";
  const isOneWayTrip = false;
  const travelStartDate = new Date();
  const travelEndDate = new Date();
  const travelArea = "2";
  const webcashReturnCode = "S";
  const webcashMercRef = "TR000001";
  const travellers = [
    {
      idNumber: "960909-10-5893",
      idNumberType: "New",
      DOB: new Date(),
      mobilePhone: "017-6994800",
      housePhone: "03-12345678",
      officePhone: "03-12345678",
      salutation: "PUN",
      gender: "F",
      maritalStatus: "S",
      race: "MAL",
      religion: "MUS",
      nationality: "MYS",
      designation: "test",
      address1: "string",
      address2: "string",
      postcode: "string",
      state: "JOH",
      travellerType: "IWB"
    }
  ];
  const args = [
    17,
    planType,
    isOneWayTrip,
    travelStartDate,
    travelEndDate,
    travelArea,
    webcashReturnCode,
    webcashMercRef,
    travellers
  ];
  let user;

  return Parse.User
    .logIn(USER_EMAIL, USER_PASSWORD)
    .then(_user => {
      user = _user;
      return purchaseTravelPolicy(user, ...args);
    })
    .then(purchase => {
      return validateTravelPurchase(purchase, user, ...args);
    })
    .then(cleanupPurchase);
});

function validatePAPurchase(
  purchase: Purchase,
  user: Parse.User,
  premium: number,
  planType: PlanNameType,
  planDurationType: PlanDurationNameType,
  medicalReimbursementCoverage: boolean,
  weeklyBenefitCoverage: boolean,
  snatchTheftCoverage: boolean,
  personalDetails: PersonalDetailsType,
  beneficiaries: Array<Policyholder>,
  webcashReturnCode: string,
  webcashMercRef: string
) {
  const today = moment
    .utc()
    .startOf("day")
    .toDate();
  const expiryDate = calculatePAPolicyExpiry(today, planDurationType);
  expect(purchase.get("premium")).toEqual(premium);
  expect(purchase.get("planType")).toEqual(planType);
  expect(purchase.get("commencementDate")).toEqual(today);
  expect(purchase.get("expiryDate")).toEqual(expiryDate);
  expect(purchase.get("webcashReturnCode")).toEqual(webcashReturnCode);
  expect(purchase.get("webcashMercRef")).toEqual(webcashMercRef);

  expect(user.get("idNumber")).toEqual(personalDetails.idNumber);
  expect(user.get("idNumberType")).toEqual(personalDetails.idNumberType);
  expect(user.get("DOB")).toEqual(personalDetails.DOB);
  expect(user.get("mobilePhone")).toEqual(personalDetails.mobilePhone);

  return purchase;
}

it("should purchase pa correctly", () => {
  let user;
  const premium = 17;
  const planType = "1";
  const planDuration = "A";
  const medicalReimbursementCoverage = false;
  const weeklybenefitCoverage = false;
  const snatchTheftCoverage = false;
  const policyholder = {
    idNumber: "960909-10-5893",
    idNumberType: "New",
    DOB: new Date(),
    mobilePhone: "017-6994800",
    gender: "F"
  };
  const beneficiaries = [];
  const webcashReturnCode = "S";
  const webcashMercRef = "TR000001";
  const args = [
    premium,
    planType,
    planDuration,
    medicalReimbursementCoverage,
    weeklybenefitCoverage,
    snatchTheftCoverage,
    policyholder,
    beneficiaries,
    webcashReturnCode,
    webcashMercRef
  ];

  return Parse.User.logIn(USER_EMAIL, USER_PASSWORD).then(_user => {
    user = _user;
    return purchasePAPolicy(user, ...args)
      .then(purchase => {
        return validatePAPurchase(purchase, user, ...args);
      })
      .then(cleanupPurchase);
  });
});
