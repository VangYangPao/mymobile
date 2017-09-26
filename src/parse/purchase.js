// @flow
import Parse from "parse/node";

export function saveNewPurchase(
  policyTypeId: string,
  pasAppId: string,
  policyId: string,
  webAppId: string,
  premium: number,
  planId: number,
  optionId: ?number,
  autoRenew: boolean,
  user: any,
  tmTxnRef: string,
  tmVerifyEnrolment: string,
  tmPaymentSuccessRes: string,
  additionalAttributes: any
) {
  const Purchase = Parse.Object.extend("Purchase");
  const purchase = new Purchase();
  purchase.set("policyTypeId", policyTypeId);
  purchase.set("pasAppId", pasAppId);
  purchase.set("policyId", policyId);
  purchase.set("webAppId", webAppId);
  purchase.set("premium", premium);
  purchase.set("planId", planId);
  purchase.set("optionId", optionId);
  purchase.set("autoRenew", autoRenew);
  purchase.set("user", user);
  purchase.set("tmTxnRef", tmTxnRef);
  purchase.set("tmVerifyEnrolment", tmVerifyEnrolment);
  purchase.set("tmPaymentSuccessRes", tmPaymentSuccessRes);

  return purchase.save().then(purchase => {
    if (
      policyTypeId === "pa" ||
      policyTypeId === "pa_mr" ||
      policyTypeId === "pa_wi"
    ) {
      const PurchaseAccident = Parse.Object.extend("PurchaseAccident");
      const { policyTermsId, commencementDate } = additionalAttributes;
      const purchaseAccident = new PurchaseAccident();
      purchaseAccident.set("policyTermsId", policyTermsId);
      purchaseAccident.set("commencementDate", commencementDate);
      purchaseAccident.set("purchaseId", purchase);
      return purchaseAccident.save();
    } else if (policyTypeId === "travel") {
      const PurchaseTravel = Parse.Object.extend("PurchaseTravel");
      const {
        countryId,
        startDate,
        endDate,
        spouse,
        children
      } = additionalAttributes;
      const purchaseTravel = new PurchaseTravel();
      purchaseTravel.set("countryId", countryId);
      purchaseTravel.set("startDate", startDate);
      purchaseTravel.set("endDate", endDate);
      purchaseTravel.set("spouse", spouse);
      purchaseTravel.set("children", children);
      return purchaseTravel.save();
    }
  });
}
