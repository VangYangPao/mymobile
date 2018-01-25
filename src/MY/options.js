// @flow
import policies from "../../data/MY/policies";
import coverages from "../../data/MY/coverage";
import { QUESTION_SETS as questionSets } from "../../data/MY/questions";
import colors from "./colors";

import paClaimQuestions from "../../data/MY/paClaimQuestions";
import travelClaimQuestions from "../../data/MY/travelClaimQuestions";
import mobileClaimQuestions from "../../data/MY/mobileClaimQuestions";
import { coverageDurations } from "../../data/MY/mappings";
import validations from "./validations";
import termsOfUseHTML from "../../documents/MY/termsOfUse";
import * as controllers from "./controllers";
import * as screens from "./screens";
import strings from "../../data/MY/strings";
import * as data from "./data";

import type { AppOptionsType } from "../../types";

const claimQuestionSets = {
  pa: paClaimQuestions,
  pa_mr: paClaimQuestions,
  pa_wi: paClaimQuestions,
  travel: travelClaimQuestions,
  mobile: mobileClaimQuestions
};

const appOptions: AppOptionsType = {
  appName: "MicroUmbrella",
  countryCode: "MY",
  currency: "RM",
  policies,
  coverages,
  questionSets,
  claimQuestionSets,
  colors,
  strings,
  validations,
  termsOfUseHTML,
  parseAppId: "microumbrella-my",
  parseServerURL: "https://api-dev-my.microumbrella.com/parse",
  appseeId: "ef742ddea5f2473d8be211c148216f20",
  screens,
  controllers,
  data
};
export default appOptions;
