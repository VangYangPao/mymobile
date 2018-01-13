// @flow
export type PlanType = {
  title: string,
  coverage: {
    [string]: number
  },
  premium: number
};

export type CoverageType = {
  title: string,
  shortTitle?: string,
  icon: string,
  description: string
};

export type PolicyType = {
  id: string,
  title: string,
  imageSource: string,
  description: string,
  plans: Array<Plan>,
  isTravelInsurance?: boolean,
  from: string,
  covered: Array<string>,
  notCovered: Array<string>,
  subclassName: string,
  endorsementFields: Array<any>
};

export type EndorsementType = {
  field: string,
  oldValue: any,
  newValue: any
};
