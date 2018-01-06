// @flow
import "./mocks";
import { generateID } from "microumbrella-core/src/utils";
import Parse from "parse/react-native";

import { saveNewClaim } from "microumbrella-core/src/parse/claims";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

it("makes claim successfully", () => {
  const policyTypeId = "pa";
  const answers = {
    accidentType: "Death",
    accidentDate: new Date(),
    accidentCause: "Death",
    accidentLocation: "Midview City",
    details: "Death",
    hasOtherInsuranceCoverage: true,
    otherInsuranceCo: "AIA",
    otherPolicyNo: "1234",
    recurrence: true,
    recurrenceDetail: "Death",
    claimFromPolicyholder: true,
    claimantFirstName: "Chan",
    claimantLastName: "Guan",
    claimantIdType: 1,
    claimantIdNo: "123",
    claimantPhone: "88888888",
    claimantEmail: "ken@micro.com",
    claimantAddress: "Midview City",
    images: {
      policeReport: ["123.jpg", "abc.jpg", "def.jpg", "ghi.jpg", "jkl.jpg"],
      medicalReceipt: ["234.png", "abc.jpg", "def.jpg", "ghi.jpg", "jkl.jpg"]
    },
    travelImages: {
      policeReport: ["123.jpg"]
    },
    nonProp: "123"
  };
  let currentUser;
  const nonProps = ["nonProp"];
  const imageProps = ["images", "travelImages"];
  const assertions = 3;
  const noOfKeys = Object.keys(answers).length - imageProps.length;
  expect.assertions(assertions + noOfKeys);
  const Purchase = Parse.Object.extend("Purchase");
  let startTime;
  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(_currentUser => {
      currentUser = _currentUser;
      const query = new Parse.Query(Purchase);
      return query.first();
    })
    .then(purchase => {
      startTime = new Date().getTime();
      return saveNewClaim(
        policyTypeId,
        answers,
        purchase,
        imageProps,
        currentUser
      );
    })
    .then(claim => {
      const endTime = new Date().getTime();
      console.log("time taken", endTime - startTime);
      expect(claim).toHaveProperty("className", "Claim");
      expect(claim).toHaveProperty("_objCount");
      expect(claim).toHaveProperty("id");
      for (var prop in answers) {
        if (
          answers.hasOwnProperty(prop) &&
          imageProps.indexOf(prop) === -1 &&
          nonProps.indexOf(prop) === -1
        ) {
          expect(claim.get(prop)).toBe(answers[prop]);
        }
      }
      nonProps.forEach(prop => {
        expect(claim.get("claimAnswers")).toHaveProperty(prop);
      });
      return claim;
    })
    .catch(err => console.error(err));
});
