// @flow
type mappingsType = {
  paTerms: { [string]: number },
  paTermIdToMonths: { [string]: number },
  paOptionIdToName: { [string]: string },
  paOptions: { [string]: number },
  fieldMapping: { [string]: string }
};

const MAPPINGS: mappingsType = {
  paTerms: {
    "1": 1,
    "3": 2,
    "6": 3,
    "12": 4
  },
  paTermIdToMonths: {
    "1": 1,
    "2": 3,
    "3": 6,
    "4": 12
  },
  paOptionIdToName: {
    "0": "pa",
    "1": "pa_mr",
    "2": "pa_wi"
  },
  paOptions: {
    pa: 0,
    pa_mr: 1,
    pa_wi: 2
  },
  fieldMapping: {
    idNumber: "ID Number",
    idNumberType: "ID Number Type"
  }
};
export default MAPPINGS;
