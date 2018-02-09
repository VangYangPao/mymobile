// @flow
import moment from "moment";
import Parse from "parse/react-native";
import type {
  Policyholder,
  PersonalDetailsType
} from "../../../types/MY/policies";
import type {
  PlanNameType,
  PlanDurationNameType
} from "../../../data/MY/pa-prices";
import { calculatePAPolicyExpiry } from "./utils";

const BASE_NO = 300000;
const PURCHASE_CLASS_NAME = "Purchase";
const Purchase = Parse.Object.extend(PURCHASE_CLASS_NAME);

// TRAVEL
const TRAVEL_POLICY_PREFIX = "TR";
const TRAVEL_POLICY_TYPE_ID = "travel";

function saveUserAttributes(user: Parse.User, policyholder: Policyholder) {
  user.set("idNumber", policyholder.idNumber);
  user.set("idNumberType", policyholder.idNumberType);
  user.set("DOB", policyholder.DOB);
  user.set("mobilePhone", policyholder.mobilePhone);
  user.set("housePhone", policyholder.housePhone);
  user.set("officePhone", policyholder.officePhone);
  user.set("salutation", policyholder.salutation);
  user.set("gender", policyholder.gender);
  user.set("maritalStatus", policyholder.maritalStatus);
  user.set("race", policyholder.race);
  user.set("religion", policyholder.religion);
  user.set("nationality", policyholder.nationality);
  user.set("designation", policyholder.designation);
  user.set("address1", policyholder.address1);
  user.set("address2", policyholder.address2);
  user.set("postcode", policyholder.postcode);
  user.set("state", policyholder.state);
  return user.save();
}

function getPolicyRunningNumber(policyTypeId: string) {
  const query = new Parse.Query(Purchase);
  query.equalTo("policyTypeId", policyTypeId);
  return query.count().then(count => {
    const policyNumber = BASE_NO + count;
    return `${TRAVEL_POLICY_PREFIX}${policyNumber}`;
  });
}

export function purchaseTravelPolicy(
  user: Parse.User,
  premium: number,
  planType: string,
  isOneWayTrip: boolean,
  travelStartDate: Date,
  travelEndDate: Date,
  travelArea: string,
  webcashReturnCode: string,
  webcashMercRef: string,
  travellers: Array<Policyholder>
) {
  const POLICY_TYPE_ID = "travel";
  const purchase = new Purchase();
  purchase.setACL(new Parse.ACL(user));

  purchase.set("policyTypeId", POLICY_TYPE_ID);
  purchase.set("commencementDate", travelStartDate);
  purchase.set("expiryDate", travelEndDate);
  purchase.set("premium", premium);
  purchase.set("planType", planType);
  purchase.set("travelArea", travelArea);
  purchase.set("tripType", isOneWayTrip ? "SGOW" : "SGRT");
  purchase.set("webcashReturnCode", webcashReturnCode);
  purchase.set("webcashMercRef", webcashMercRef);
  purchase.set("user", user);

  const policyholder: Policyholder = travellers.find(traveller => {
    return traveller.travellerType === "IWB";
  });

  return getPolicyRunningNumber(POLICY_TYPE_ID)
    .then(policyId => {
      purchase.set("policyId", policyId);
      return saveUserAttributes(user, policyholder);
    })
    .then(user => {
      return purchase.save();
    })
    .then(purchase => {
      return purchase;
    })
    .catch(err => console.log(err));
}

export function purchasePAPolicy(
  user: Parse.User,
  premium: number,
  planType: PlanNameType,
  planDurationType: PlanDurationNameType,
  medicalReimbursementCoverage: boolean,
  weeklyBenefitCoverage: boolean,
  snatchTheftCoverage: boolean,
  personalDetails: PersonalDetailsType,
  beneficiaries: Array<Policyholder>,
  webcashReturnCode: string,
  webcashMercRef: string
) {
  const POLICY_TYPE_ID = "pa";
  const purchase = new Purchase();
  purchase.setACL(new Parse.ACL(user));

  const todayDate = moment
    .utc()
    .startOf("day")
    .toDate();
  const expiryDate = calculatePAPolicyExpiry(todayDate, planDurationType);
  purchase.set("policyTypeId", POLICY_TYPE_ID);
  purchase.set("commencementDate", todayDate);
  purchase.set("expiryDate", expiryDate);
  purchase.set("premium", premium);
  purchase.set("planType", planType);
  purchase.set("webcashReturnCode", webcashReturnCode);
  purchase.set("webcashMercRef", webcashMercRef);
  purchase.set("user", user);

  user.set("idNumberType", personalDetails.idNumberType);
  user.set("idNumber", personalDetails.idNumber);
  user.set("DOB", personalDetails.DOB);
  user.set("gender", personalDetails.gender);
  user.set("mobilePhone", personalDetails.mobilePhone);

  return getPolicyRunningNumber(POLICY_TYPE_ID)
    .then(policyId => {
      purchase.set("policyId", policyId);
      return user.save();
    })
    .then(user => {
      return purchase.save();
    });
}
