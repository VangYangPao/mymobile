// @flow
import moment from "moment";

export default function getPolicyEndDate(purchase: any, subPurchase: any) {
  const policyTypeId = purchase.get("policyTypeId");

  if (policyTypeId === "pa") {
    const commencementDate = subPurchase.get("commencementDate");
    const endDate = moment(commencementDate)
      .add(1, "months")
      .toDate();
    return endDate;
  } else if (policyTypeId === "travel") {
    const endDate = subPurchase.get("endDate");
    return endDate;
  } else if (policyTypeId === "mobile") {
    const commencementDate = subPurchase.get("commencementDate");
    const endDate = moment(commencementDate)
      .add(1, "years")
      .toDate();
    return endDate;
  }
}
