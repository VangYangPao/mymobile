// @flow
import moment from "moment";

import type { PolicyType } from "../../types";
import {
  getTravelQuote,
  getAccidentQuote,
  getPhoneProtectQuote,
  purchaseTravelPolicy,
  purchaseAccidentPolicy,
  purchasePhonePolicy
} from "./hlas";
import mappings from "../../data/SG/mappings";

export { default as getPolicyEndDate } from "./policyEndDate";

export function getProductQuote(
  policy: PolicyType,
  form: Object
): Promise<number> {
  let promise;
  if (policy && policy.id === "travel") {
    const countryid = form.travelDestination;
    const tripDurationInDays =
      moment(form.returnDate).diff(form.departureDate, "days") + 1;
    const planid = form.planIndex;
    const [hasSpouse, hasChildren] = this.getHasSpouseAndChildren(
      form.travellers
    );
    promise = getTravelQuote(
      countryid,
      tripDurationInDays,
      planid,
      hasSpouse,
      hasChildren
    );
  } else if (
    policy &&
    (policy.id === "pa" || policy.id === "pa_mr" || policy.id === "pa_wi")
  ) {
    const planid = form.planIndex;
    const termid = mappings.paTerms[form.coverageDuration];
    const optionid = mappings.paOptions[policy.id];
    const commencementDate = new Date();
    promise = getAccidentQuote(planid, termid, optionid, commencementDate);
  } else if (policy && policy.id === "mobile") {
    promise = getPhoneProtectQuote();
  } else {
    promise = new Promise((resolve, reject) =>
      reject(`Policy type of ${policy.id} not found`)
    );
  }
  return promise.then(res => {
    // throw new Error("yolo");
    console.log(res);
    return res.data;
  });
}
