import "./mocks";
import Parse from "parse/react-native";
import validations from "../src/validations";

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
      return validatePurchaseIdNumber("a696967", answers);
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
