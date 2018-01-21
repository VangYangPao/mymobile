// @flow
import moment from "moment";
import TRPrices from "../../data/MY/tr-prices";
import PAPrices from "../../data/MY/pa-prices";

import type { TRPriceType, PackageNamesType } from "../../data/MY/tr-prices";
import type {
  PlanNameType,
  PlanDurationNameType
} from "../../data/MY/pa-prices";

/*
 * Computes the key for a given duration for Single Trip only
 **/
function mapDurationToKeys(duration: number): string {
  if (duration >= 1 && duration <= 5) {
    return "1-5";
  } else if (duration >= 6 && duration <= 10) {
    return "6-10";
  } else if (duration >= 11 && duration <= 18) {
    return "11-18";
  } else if (duration >= 19) {
    return "19-31";
  } else {
    throw new Error("Duration in days cannot be less than zero");
  }
}

/**
PLANS
IO = Individual only
IS = Individual & spouse
IF = Individual & family
IFAC = Individual & family + Additional Child

PACKAGE TYPES
// 1 = Basic
2 = Premier
3 = Elite

TRAVEL PLAN TYPES
2 = Asia Pacific
3 = Worldwide excl. USA & Canada
4 = Worldwide incl. USA & Canada
**/
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
  if (singleTrip && annualTrip) {
    throw new Error(
      "Argument 'singleTrip' and 'annualTrip' cannot both be true"
    );
  } else if (singleTrip) {
    durationKey = "OWay";
  } else if (annualTrip) {
    durationKey = "Annual";
  }
  const isSingleTrip = durationKey !== "OWay" && durationKey !== "Annual";
  let premium = TRPrices[packageKey][durationKey][planType][travelArea];

  if (isSingleTrip) {
    premium += calculateAdditionalWeekPremium(
      durationInDays,
      packageKey,
      planType,
      travelArea
    );
  }

  const CHILD_LIMIT = 4;
  if (noOfChildren > CHILD_LIMIT) {
    const ADD_CHILDREN_PKG = "IFAC";
    const additionalChildren = noOfChildren - CHILD_LIMIT;
    const additionalChildPremium =
      TRPrices[ADD_CHILDREN_PKG][durationKey][planType][travelArea];
    premium += additionalChildren * additionalChildPremium;

    if (isSingleTrip) {
      const additionalWeekPremium = calculateAdditionalWeekPremium(
        durationInDays,
        ADD_CHILDREN_PKG,
        planType,
        travelArea
      );
      premium += additionalChildren * additionalWeekPremium;
    }
  }
  return premium;
}

function calculateAdditionalWeekPremium(
  durationInDays: number,
  packageKey: PackageNamesType,
  planType: number,
  travelArea: number
): number {
  if (durationInDays > 31) {
    const additionalDays = durationInDays - 31;
    const additionalWeeks = Math.ceil(additionalDays / 7);
    const additionalWeekPremium =
      TRPrices[packageKey]["EAWeek"][planType][travelArea];
    return additionalWeeks * additionalWeekPremium;
  }
  return 0;
}

/**
PA PLAN DURATION
A = 14 days
B = 1 month
C = 3 months
D = 6 months
E = 1 year
**/
export function getPAPremium(
  planDuration: PlanDurationNameType,
  planType: PlanNameType,
  medicalReimbursementCoverage: boolean,
  weeklyBenefitCoverage: boolean,
  snatchTheftCoverage: boolean
): number {
  const BASIC_COVERAGE = "adpd";
  const MEDICAL_REIMBURSEMENT_COVERAGE = "mr";
  const WEEKLY_BENEFIT_COVERAGE = "wb";
  const SNATCH_THEFT_COVERAGE = "st";
  let premium = PAPrices[planDuration][planType][BASIC_COVERAGE];
  if (medicalReimbursementCoverage) {
    premium += PAPrices[planDuration][planType][MEDICAL_REIMBURSEMENT_COVERAGE];
  }
  if (weeklyBenefitCoverage) {
    premium += PAPrices[planDuration][planType][WEEKLY_BENEFIT_COVERAGE];
  }
  if (snatchTheftCoverage) {
    premium += PAPrices[planDuration][planType][SNATCH_THEFT_COVERAGE];
  }
  return premium;
}
