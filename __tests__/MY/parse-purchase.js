import "../mocks";
import Parse from "parse/react-native";

import { MY as secrets } from "../../secrets/secrets";

Parse.initialize(secrets.appName);
Parse.serverURL = secrets.serverURL;
Parse.masterKey = secrets.masterKey;

import {
  purchaseTravelPolicy,
  purchasePAPolicy
} from "../../src/MY/parse/purchase";
import moment from "moment";

const USER_EMAIL = "hello@microumbrella.com";
const USER_PASSWORD = "1234abcd";

const Purchase = Parse.Object.extend("Purchase");

function cleanupPurchase(purchase: Purchase) {
  return purchase.destroy({ useMasterKey: true });
}

it("should purchase travel correctly", () => {
  const premium = 17;
  const planType = "IO";
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
      relationship: "IWB"
    }
  ];

  return Parse.User
    .logIn(USER_EMAIL, USER_PASSWORD)
    .then(user => {
      return purchaseTravelPolicy(
        user,
        17,
        planType,
        isOneWayTrip,
        travelStartDate,
        travelEndDate,
        travelArea,
        webcashReturnCode,
        webcashMercRef,
        travellers
      );
    })
    .then(cleanupPurchase);
});
