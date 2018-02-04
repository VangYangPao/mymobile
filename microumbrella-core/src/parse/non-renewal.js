// @flow
import Parse from "parse/react-native";
import moment from "moment";

import AppStore from "../../stores/AppStore";

const NonRenewal = Parse.Object.extend("NonRenewal");

export function saveNonRenewal(purchase: any, subPurchase: any) {
  const nonRenewal = new NonRenewal();
  nonRenewal.set("purchase", purchase);
  const policyTypeId = purchase.get("policyTypeId");

  const policyEndDate = AppStore.controllers.getPolicyEndDate(
    purchase,
    subPurchase
  );
  // cancellation effective date is a day after end date
  const cancellationEffectiveDate = moment(policyEndDate)
    .add(1, "days")
    .toDate();
  nonRenewal.set("cancellationEffectiveDate", cancellationEffectiveDate);
  const user = purchase.get("user");
  nonRenewal.setACL(new Parse.ACL(user));
  return nonRenewal.save();
}
