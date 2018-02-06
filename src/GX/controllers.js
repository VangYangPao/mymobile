// @flow
import moment from "moment";

import type { PolicyType } from "../../types";
import mappings from "../../data/GX/mappings";

export function getProductQuote(
  policy: PolicyType,
  form: Object
): Promise<number> {
  return new Promise((resolve, reject) => {
    resolve(18);
  });
}

export function purchaseProduct() {
  return new Promise((resolve, reject) => {
    resolve({});
  });
}
