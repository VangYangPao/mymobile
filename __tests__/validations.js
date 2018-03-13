import "./mocks";
import Parse from "parse/react-native";

jest.mock("../microumbrella-core-sg/stores/AppStore", () => {
  return {
    Parse: require("parse/react-native")
  };
});

import validations from "../src/SG/validations";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const validatePurchaseIdNumber = validations.purchaseIdNumber;

it("validates ID number before purchasing PA", () => {
  let answers = {
    policy: { id: "pa" }
  };
  answers.coverageDuration = 1;
  return Parse.User
    .logIn("hello@micro.com", "1234abcd")
    .then(user => {
      return validatePurchaseIdNumber("S9555002I", answers);
    })
    .then(result => {
      expect(result).toHaveProperty("isValid", false);
      //   answers.coverageDuration = 3;
      //   return validatePurchaseIdNumber("a696969", answers);
      // })
      // .then(result => {
      //   expect(result).toHaveProperty("isValid", false);
      //   return;
    })
    .catch(err => {
      console.error(err);
    });
});
