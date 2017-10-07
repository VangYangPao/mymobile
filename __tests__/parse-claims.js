// @flow
import "./mocks";
import { generateID } from "../src/utils";
import Parse from "parse/react-native";

import { testSaveNewClaim } from "./parse-functions";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("makes claim successfully", () => {
  return testSaveNewClaim()
    .then(res => {
      expect(res).toHaveProperty("className", "Claim");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
    })
    .catch(err => console.error(err));
});
