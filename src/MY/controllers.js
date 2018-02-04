// @flow
import Parse from "parse/react-native";

import { getTravelPremium, getPAPremium } from "./premiums";
import { purchaseTravelPolicy, purchasePAPolicy } from "./parse/purchase";
import type { PolicyType } from "../../types";
import type { TravellerType } from "./types.my";

const Purchase = Parse.Object.extend("Purchase");

function getTravellerFlags(
  travellers: Array<TravellerType>
): [boolean, number] {
  const spouseIndex = travellers.findIndex(traveller => {
    return traveller.travellerType === "ISP";
  });
  const hasSpouse = spouseIndex !== -1;
  const children = travellers.filter(traveller => {
    return traveller.travellerType === "CHI";
  });
  const noOfChildren = children.length;
  return [hasSpouse, noOfChildren];
}

export function getProductQuote(
  policy: PolicyType,
  form: Object
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (policy.id === "travel") {
      const [hasSpouse, noOfChildren] = getTravellerFlags([]);
      const planType = form.planIndex.toString();
      const travelArea = form.travelArea;
      const premium = getTravelPremium(
        form.departureDate,
        form.returnDate,
        form.isOneWayTrip,
        false, // TMP: DEFAULT TO FALE FIRST form.annualTrip
        hasSpouse,
        noOfChildren,
        planType,
        travelArea
      );
      resolve(premium);
    } else if (policy.id === "pa") {
      const premium = getPAPremium(
        form.planDuration,
        form.planType.toString(),
        form.medicalReimbursementCoverage,
        form.weeklyBenefitCoverage,
        form.snatchTheftCoverage
      );
      resolve(premium);
    } else {
      reject("Cannot find policy type: " + policy.id);
    }
  });
}

export function getPolicyEndDate(purchase: Purchase, subpurchase: null) {
  return purchase.get("expiryDate");
}

export function purchaseProduct(
  user: Parse.User,
  policy: PolicyType,
  premium: number,
  form: Object,
  paymentForm: Object
): Promise<Parse.Object> {
  let promise;
  if (policy.id === "travel") {
    return purchaseTravelPolicy(
      user,
      premium,
      form.planIndex,
      form.isOneWayTrip,
      form.departureDate,
      form.returnDate,
      form.travelArea,
      paymentForm.responseCode,
      paymentForm.merchantRef,
      form.travellers
    );
  } else if (policy.id === "pa") {
    return purchasePAPolicy();
  } else {
    return new Promise((resolve, reject) =>
      reject("Cannot find policy type: " + policy.id)
    );
  }
}
