// @flow
export type Policyholder = {
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
  travellerType: string
};

export type PersonalDetailsType = {
  idNumber: string,
  idNumberType: string,
  DOB: Date,
  gender: string,
  mobilePhone: string
};
