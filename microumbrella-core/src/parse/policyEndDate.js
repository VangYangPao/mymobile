// @flow
import moment from "moment";

import mappings from "../../data/mappings";

export default function getPolicyEndDate(purchase: any, subPurchase: any) {
  const policyTypeId = purchase.get("policyTypeId");

  if (policyTypeId === "pa") {
    const policyTermsId = subPurchase.get("policyTermsId");
    const months = mappings.paTermIdToMonths[policyTermsId];
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
