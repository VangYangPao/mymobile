// @flow
import moment from "moment";

export default function getPolicyEndDate(purchase: any, subPurchase: any) {
  const policyTypeId = purchase.get("policyTypeId");

  if (policyTypeId === "pa") {
    const termMapping = {
      1: 1,
      2: 3,
      3: 6,
      4: 12
    };
    const policyTermsId = subPurchase.get("policyTermsId");
    const months = termMapping[policyTermsId];
    const commencementDate = subPurchase.get("commencementDate");
    const endDate = moment(commencementDate)
      .add(months, "months")
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
