// @flow
import type { QuestionSetTypeStr } from "./app";
import type { PolicyType } from "./policies";

export type ChatNavigationState = {
  params: {
    isStartScreen: boolean,
    questionSet: QuestionSetTypeStr,
    policy: PolicyType,
    chatScreenState: Object
  }
};
