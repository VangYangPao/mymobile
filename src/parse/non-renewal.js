// @flow
import Parse from "parse/react-native";
import moment from "moment";

const NonRenewal = Parse.Object.extend("NonRenewal");

export function saveNonRenewal(purchase: any, subPurchase: any) {
  const nonRenewal = new NonRenewal();
  nonRenewal.set("purchase", purchase);
  const policyTypeId = purchase.get("policyTypeId");

  if (policyTypeId === "pa" || policyTypeId === "mobile") {
    const commencementDate = subPurchase.get("commencementDate");
    const cancellationEffectiveDate = moment(commencementDate)
      .add(1, "months")
      .add(1, "days")
      .toDate();
    nonRenewal.set("cancellationEffectiveDate", cancellationEffectiveDate);
  } else if (policyTypeId === "travel") {
    const endDate = subPurchase.get("endDate");
    const cancellationEffectiveDate = moment(endDate)
      .add(1, "days")
      .toDate();
    nonRenewal.set("cancellationEffectiveDate", cancellationEffectiveDate);
  }
  const user = purchase.get("user");
  nonRenewal.setACL(new Parse.ACL(user));
  return nonRenewal.save();
}
