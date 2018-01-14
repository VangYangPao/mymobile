// @flow

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
