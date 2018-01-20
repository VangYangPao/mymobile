// @flow
import moment from "moment";
import Parse from "parse/react-native";
import TRPrices from "../../data/MY/tr-prices";
import PAPrices from "../../data/MY/pa-prices";

import type { PolicyType } from "../../types";
import type { TRPriceType } from "../../data/MY/tr-prices";
// PLANS
// IO = Individual only
// IS = Individual & spouse
// IF = Individual & family

// PACKAGE TYPES
// 1 = Basic
// 2 = Premier
// 3 = Elite

// TRAVEL PLAN TYPES
// 2 = Asia Pacific
// 3 = Worldwide excl. USA & Canada
// 4 = Worldwide incl. USA & Canada

// PA PLAN DURATION
// A = 14 days
// B = 1 month
// C = 3 months
// D = 6 months
// E = 1 year

/*
 * Computes the key for a given duration for Single Trip only
 **/
function mapDurationToKeys(duration: number) {
  if (duration >= 1 && duration <= 5) {
    return "1-5";
  } else if (duration >= 6 && duration <= 10) {
    return "6-10";
  } else if (duration >= 11 && duration <= 18) {
    return "11-18";
  } else if (duration >= 19) {
    return "19-31";
  }
}

export function getTravelPremium(
  startDate: Date,
  endDate: Date,
  singleTrip: boolean,
  annualTrip: boolean,
  spouse: boolean,
  noOfChildren: number,
  planType: number,
  travelArea: number
): number {
  const durationInDays = moment(endDate).diff(startDate, "days");
  let packageKey;
  if (!spouse && noOfChildren === 0) {
    packageKey = "IO";
  } else if (spouse && noOfChildren === 0) {
    packageKey = "IS";
  } else if (spouse && noOfChildren > 0) {
    packageKey = "IF";
  } else {
    throw new Error("Spouse cannot be false if accompanied by children");
  }
  let durationKey = mapDurationToKeys(durationInDays);
  if (singleTrip) {
    durationKey = "OWay";
  } else if (annualTrip) {
    durationKey = "Annual";
  }
  let premium = TRPrices[packageKey][durationKey][planType][travelArea];
  if (durationInDays > 31) {
    const additionalDays = durationInDays - 31;
    const additionalWeeks = Math.ceil(additionalDays / 7);
    const additionalWeekPremium =
      TRPrices[packageKey]["EAWeek"][planType][travelArea];
    premium += additionalWeeks * additionalWeekPremium;
  }
  return premium;
}

function getPAPremium(
  planType,
  planDuration,
  medicalReimbursementCoverage,
  weeklyBenefitCoverage,
  snatchTheftCoverage
) {
  let premium = PA_PACKAGE[planDuration][planType];
  if (medicalReimbursementCoverage) {
    premium += MEDICAL_REIMBURSEMENT_COVERAGE[planDuration][planType];
  }
  if (weeklyBenefitCoverage) {
    premium += WEEKLY_BENEFIT_COVERAGE[planDuration][planType];
  }
  if (snatchTheftCoverage) {
    premium += SNATCH_THEFT_COVERAGE[planDuration][planType];
  }
  return premium;
}

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
    resolve();
  });
}
