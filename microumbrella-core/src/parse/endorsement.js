// @flow
import Parse from "parse/react-native";

import type { EndorsementType } from "../types/policies";

const Endorsement = Parse.Object.extend("Endorsement");

/*
 * To call before setting values
 */
export function saveNewEndorsement(
  purchase: any,
  endorsements: Array<EndorsementType>
) {
  const endorsement = new Endorsement();
  endorsement.set("purchase", purchase);
  endorsement.set("changes", endorsements);
  const user = purchase.get("user");
  endorsement.setACL(new Parse.ACL(user));
  return endorsement.save();
}
