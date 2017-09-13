export type ProductPlanID = 1 | 2 | 84 | 85;

export type PaymentDetails = {
  NameOnCard: string,
  CardNumber: string,
  CardType: 2 | 3,
  CardSecurityCode: string,
  CardExpiryYear: number,
  CardExpiryMonth: number
};

export type PolicyHolder = {
  Surname: string,
  GivenName: string,
  IDNumber: string,
  IDNumberType: number,
  DateOfBirth: string,
  GenderID: number,
  MobileTelephone: string,
  Email: string,
  UnitNumber: string,
  BlockHouseNumber: string,
  BuildingName: string,
  StreetName: string,
  PostalCode: string
};

export type Traveller = {
  Surname: string,
  GivenName: string,
  IDNumber: string,
  IDNumberType: number,
  DateOfBirth: string,
  GenderID: number,
  RelationshipID: number
};
