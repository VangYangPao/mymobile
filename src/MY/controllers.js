// @flow
import Parse from "parse/react-native";

import { getTravelPremium, getPAPremium } from "./premiums";
import type { PolicyType } from "../../types";

export function getProductQuote(
  policy: PolicyType,
  form: Object
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (policy.id === "travel") {
      const hasSpouse = !!form.spouse;
      const noOfChildren = form.children.length;
      const planType = form.planType;
      const travelArea = form.travelArea;
      const premium = getTravelPremium(
        form.startDate,
        form.endDate,
        form.singleTrip,
        form.annualTrip,
        hasSpouse,
        noOfChildren,
        planType,
        travelArea
      );
      resolve(premium);
    } else if (policy.id === "pa") {
      resolve();
    } else {
      reject("No found policy type: " + policy.id);
    }
  });
}

export function purchaseProduct(
  policy: PolicyType,
  premium: number,
  form: Object,
  paymentForm: Object
): Promise<Parse.Object> {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
