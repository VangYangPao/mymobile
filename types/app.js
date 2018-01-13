// @flow
import { Image } from "react-native";
import { Policy } from "./policies";
import Parse from "parse/react-native";
import type { CoverageType } from "./policies";

export type ValidationResult = {
  errMessage: string | boolean,
  isValid: boolean
};

export type QuestionResponseType = string | Array<string> | null;

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
  responseType: QuestionResponseType,
  responseLength?: number,
  include?: Array<string>,
  exclude?: Array<string>,
  condition?: string,
  defaultValue?: string,
  columns?: Array<QuestionResponseType>,
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

export type AppOptionsType = {
  parseAppId: string,
  parseServerURL: string,
  colors: { [string]: string },
  policies: Array<Policy>,
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
  fetchPurchases: (parseInstance: Parse, parseUser: Parse.User) => Parse.Query,
  pushClaimQuestionsOfType: (policyType: string) => void,
  termsOfUseHTML: string
};
