// @flow
import Parse from "parse/react-native";

type Policyholder = {
  idNumber: string,
  idNumberType: string,
  DOB: Date,
  mobilePhone: string,
  housePhone: string,
  officePhone: string,
  salutation: string,
  gender: string,
  maritalStatus: string,
  race: string,
  religion: string,
  nationality: string,
  designation: string,
  address1: string,
  address2: string,
  postcode: string,
  state: string,
  relationship: string
};

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
  return user.save(null, { useMasterKey: true });
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
  const Purchase = Parse.Object.extend("Purchase");
  const purchase = new Purchase();
  purchase.setACL(new Parse.ACL(user));

  purchase.set("policyTypeId", "travel");
  purchase.set("commencementDate", travelStartDate);
  purchase.set("expiryDate", travelEndDate);
  purchase.set("premium", premium);
  purchase.set("planType", planType);
  purchase.set("travelArea", travelArea);
  purchase.set("tripType", isOneWayTrip ? "SGOW" : "SGRT");
  purchase.set("webcashReturnCode", webcashReturnCode);
  purchase.set("webcashMercRef", webcashMercRef);
  purchase.set("policyholder", user);

  const policyholder: Policyholder = travellers.find(traveller => {
    return traveller.relationship === "IWB";
  });

  return saveUserAttributes(user, policyholder)
    .then(user => {
      return purchase.save();
    })
    .catch(err => console.log(err));
}

export function purchasePAPolicy(user: Parse.User) {}
