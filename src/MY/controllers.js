// @flow

import Parse from "parse/react-native";
import type { PolicyType } from "../../types";

export function getProductQuote(
  policy: PolicyType,
  form: Object
): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(17.7);
    }, 1000);
  });
}

export function purchaseProduct(
  policy: PolicyType,
  premium: number,
  form: Object,
  paymentForm: Object
): Promise<Parse.Object> {
  return new Promise((resolve, reject) => {
    console.log("pass");
  });
}
