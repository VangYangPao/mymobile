import policies from "../../data/MY/policies";
import coverages from "../../data/MY/coverage";
import { QUESTION_SETS as questionSets } from "../../data/MY/questions";
import colors from "./colors";

import paClaimQuestions from "../../data/MY/paClaimQuestions";
import travelClaimQuestions from "../../data/MY/travelClaimQuestions";
import mobileClaimQuestions from "../../data/MY/mobileClaimQuestions";

import validations from "./validations";

import termsOfUseHTML from "../../documents/MY/termsOfUse";

const claimQuestionSets = {
  pa: paClaimQuestions,
  pa_mr: paClaimQuestions,
  pa_wi: paClaimQuestions,
  travel: travelClaimQuestions,
  mobile: mobileClaimQuestions
};

export default (appOptions = {
  countryCode: "MY",
  policies,
  coverages,
  questionSets,
  claimQuestionSets,
  colors,
  validations,
  termsOfUseHTML,
  parseAppId: "microumbrella",
  parseServerURL: "https://api-dev.microumbrella.com/parse",
  appseeId: "ef742ddea5f2473d8be211c148216f20"
});
