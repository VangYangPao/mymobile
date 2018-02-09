// @flow
import moment from "moment";
import coverageDurations from "../../../data/MY/coverageDurations";
import type { PlanDurationNameType } from "../../../data/MY/pa-prices";

export function calculatePAPolicyExpiry(
  commencementDate: Date,
  planDurationType: PlanDurationNameType
): Date {
  // const moment(commencementDate)
  const coverageDuration = coverageDurations.find(
    c => c.id === planDurationType
  );
  if (!coverageDuration) {
    throw new Error(
      "Plan duration type '" + planDurationType + "' is not found"
    );
  }
  const { unit: timeUnit, value: timeValue } = coverageDuration;
  const expiryDate = moment(commencementDate)
    .add(timeValue, timeUnit)
    .startOf("day")
    .toDate();
  return expiryDate;
}
