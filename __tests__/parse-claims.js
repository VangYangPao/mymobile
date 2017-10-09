// @flow
import "./mocks";
import { generateID } from "../src/utils";
import Parse from "parse/react-native";

import { testSaveNewClaim } from "./parse-functions";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("makes claim successfully", () => {
  const policyTypeId = "pa";
  const answers = {
    images: {
      policeReport: "123.jpg",
      medicalReceipt: "234.png"
    },
    travelImages: {
      policeReport: "123.jpg"
    },
    testing: "123"
  };
  let currentUser;
  const imageProps = ["images", "travelImages"];
  const Purchase = Parse.Object.extend("Purchase");
  Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(_currentUser => {
      currentUser = _currentUser;
      const query = new Parse.Query(Purchase);
      return query.first();
    })
    .then(purchase => {
      return saveNewClaim(
        policyTypeId,
        answers,
        purchase,
        imageProps,
        currentUser
      );
    })
    .then(res => {
      expect(res).toHaveProperty("className", "Claim");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => console.error(err));
});
