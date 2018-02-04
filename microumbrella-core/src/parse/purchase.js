// @flow
import Parse from "parse/react-native";
import moment from "moment";
import mappings from "../../data/mappings";

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
  user: Parse.User,
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

  const isPA =
    policyTypeId === "pa" ||
    policyTypeId === "pa_mr" ||
    policyTypeId === "pa_wi";

  if (isPA) {
    const { commencementDate, policyTermsId } = additionalAttributes;
    const months = mappings.paTermIdToMonths[policyTermsId];
    const policyExpiryDate = moment(commencementDate)
      .add(months, "months")
      .toDate();
    purchase.set("policyExpiryDate", policyExpiryDate);
  } else if (policyTypeId === "mobile") {
    const { commencementDate } = additionalAttributes;
    const policyExpiryDate = moment(commencementDate)
      .add(1, "years")
      .toDate();
    purchase.set("policyExpiryDate", policyExpiryDate);
  }

  return purchase.save().then(purchase => {
    if (isPA) {
      const PurchaseAccident = Parse.Object.extend("PurchaseAccident");
      const {
        policyTermsId,
        commencementDate,
        occupationId
      } = additionalAttributes;
      const startofCommencementDate = moment(commencementDate)
        .startOf("day")
        .toDate();
      const purchaseAccident = new PurchaseAccident();
      purchaseAccident.setACL(new Parse.ACL(user));
      purchaseAccident.set("policyTermsId", policyTermsId);
      purchaseAccident.set("commencementDate", startofCommencementDate);
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
      const {
        serialNo,
        brandId,
        modelId,
        purchaseDate,
        commencementDate
      } = additionalAttributes;
      const startofCommencementDate = moment(commencementDate)
        .startOf("day")
        .toDate();
      const purchasePhone = new PurchasePhone();
      purchasePhone.setACL(new Parse.ACL(user));
      purchasePhone.set("commencementDate", startofCommencementDate);
      purchasePhone.set("serialNo", serialNo);
      purchasePhone.set("brandId", brandId);
      purchasePhone.set("modelId", modelId);
      purchasePhone.set("purchaseDate", purchaseDate);
      purchasePhone.set("purchaseId", purchase);
      return purchasePhone.save();
    }
  });
}
