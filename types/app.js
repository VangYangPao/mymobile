// @flow
import { Image } from "react-native";
import type { PolicyType } from "./policies";
import Parse from "parse/react-native";
import type { CoverageType } from "./policies";

export type ValidationResult = {
  errMessage: string | boolean,
  isValid: boolean
};

export type QuestionResponseType = string;

export type QuestionChoiceType = {
  label: string,
  value: string | number
};

export type DateTimePropType = {
  pastOnly?: boolean,
  futureOnly?: boolean,
  minDateFrom?: string
};

export type QuestionTableColumnType = {
  label: string,
  id: string,
  responseLength?: number,
  responseType?: QuestionResponseType,
  choices?: Array<QuestionChoiceType>,
  value?: any,
  ...DateTimePropType
};

export type SearchOptionsType = {
  keys: Array<string>,
  threshold: number
};

export type MultiResponseType = string | Array<string>;

export type QuestionType = {
  id: MultiResponseType,
  labels?: MultiResponseType,
  question: string,
  responseType: Array<string>,
  responseLength?: number,
  include?: string,
  exclude?: string,
  condition?: string,
  defaultValue?: string,
  columns?: Array<QuestionTableColumnType>,
  searchChoices?: boolean,
  searchOptions?: SearchOptionsType,
  ...DateTimePropType
};

export type QuestionSetType = Array<QuestionType>;

export type QuestionSetTypeStr = "buy" | "claim";

export type BuyClaimQuestionSetType = {
  buy: QuestionSetType,
  claim: QuestionSetType
};

export type ValidationFunctionType = (
  answer: any,
  answers: Object
) => ValidationResult | Promise<ValidationResult>;

export type ValidationsType = {
  [string]: ValidationFunctionType
};

export type ControllerFunctionsType = {
  getProductQuote: (policy: PolicyType, form: Object) => Promise<number>,
  purchaseProduct: (
    policy: PolicyType,
    premium: number,
    form: Object,
    paymentForm: Object
  ) => Promise<Parse.Object>
};

export type AppOptionsType = {
  countryCode: string,
  currency: string,
  parseAppId: string,
  parseServerURL: string,
  appseeId: string,
  colors: { [string]: string },
  policies: Array<PolicyType>,
  coverages: { [string]: CoverageType },
  authBackgroundImage?: Image,
  validations: { [string]: ValidationResult },
  questionSets: {
    buy: Array<QuestionType>,
    claim: Array<QuestionType>
  },
  claimQuestionSets: {
    [string]: Array<QuestionType>
  },
  fetchPurchases?: (parseInstance: Parse, parseUser: Parse.User) => Parse.Query,
  pushClaimQuestionsOfType?: (policyType: string) => void,
  termsOfUseHTML: string,
  controllers: ControllerFunctionsType
};
