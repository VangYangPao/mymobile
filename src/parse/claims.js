// @flow

import Parse from "parse/react-native";

export function saveNewClaim(
  policyTypeId: string,
  claimAnswers: any,
  purchase: any
) {
  const Claim = Parse.Object.extend("Claim");
  const claim = new Claim();
  console.log(claimAnswers);
  // claim.set("policyTypeId", policyTypeId);
  // claim.set("claimAnswers", claimAnswers);
  // claim.set("purchase", purchase);
  // return claim.save();
}
