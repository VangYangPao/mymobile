// @flow
import Parse from "parse/react-native";

export function saveNewPurchase(
  policyTypeId: string,
  pasAppId: string,
  policyId: string,
  webAppId: string,
  premium: number,
  planId: number,
  optionId: ?number,
  autoRenew: boolean,
  policyholderIdType: number,
  policyholderIdNo: string,
  user: any,
  tmTxnRef: string,
  tmVerifyEnrolment: string,
  tmPaymentSuccessRes: string,
  additionalAttributes: any
) {
  const Purchase = Parse.Object.extend("Purchase");
  const purchase = new Purchase();
  purchase.setACL(new Parse.ACL(user));
  purchase.set("policyTypeId", policyTypeId);
  purchase.set("pasAppId", "" + pasAppId);
  purchase.set("policyId", policyId);
  purchase.set("webAppId", webAppId);
  purchase.set("premium", premium);
  purchase.set("planId", planId);
  purchase.set("optionId", optionId);
  purchase.set("autoRenew", autoRenew);
  purchase.set("policyholderIdNo", policyholderIdNo);
  purchase.set("policyholderIdType", policyholderIdType);
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
      const {
        policyTermsId,
        commencementDate,
        occupationId
      } = additionalAttributes;
      const purchaseAccident = new PurchaseAccident();
      purchaseAccident.setACL(new Parse.ACL(user));
      purchaseAccident.set("policyTermsId", policyTermsId);
      purchaseAccident.set("commencementDate", commencementDate);
      purchaseAccident.set("occupationId", occupationId);
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
      purchaseTravel.setACL(new Parse.ACL(user));
      purchaseTravel.set("countryId", countryId);
      purchaseTravel.set("startDate", startDate);
      purchaseTravel.set("endDate", endDate);
      purchaseTravel.set("spouse", spouse);
      purchaseTravel.set("children", children);
      purchaseTravel.set("purchaseId", purchase);
      return purchaseTravel.save();
    } else if (policyTypeId === "mobile") {
      const PurchasePhone = Parse.Object.extend("PurchasePhone");
      const { serialNo, brandId, modelId, purchaseDate } = additionalAttributes;
      const purchasePhone = new PurchasePhone();
      purchasePhone.setACL(new Parse.ACL(user));
      purchasePhone.set("serialNo", serialNo);
      purchasePhone.set("brandId", brandId);
      purchasePhone.set("modelId", modelId);
      purchasePhone.set("purchaseDate", purchaseDate);
      purchasePhone.set("purchaseId", purchase);
      return purchasePhone.save();
    }
  });
}
