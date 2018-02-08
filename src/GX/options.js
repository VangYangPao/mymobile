// @flow
import policies from "../../data/GX/policies";
import coverages from "../../data/GX/coverage";
import { QUESTION_SETS as questionSets } from "../../data/GX/questions";
import colors from "./colors";

import paClaimQuestions from "../../data/GX/paClaimQuestions";
import travelClaimQuestions from "../../data/GX/travelClaimQuestions";
import mobileClaimQuestions from "../../data/GX/mobileClaimQuestions";
import validations from "./validations";
import termsOfUseHTML from "../../documents/GX/termsOfUse";
import * as screens from "./screens";
import * as controllers from "./controllers";

import type { AppOptionsType } from "../../types";

const claimQuestionSets = {
  pa: paClaimQuestions,
  pa_mr: paClaimQuestions,
  pa_wi: paClaimQuestions,
  travel: travelClaimQuestions,
  mobile: mobileClaimQuestions
};

const appOptions: AppOptionsType = {
  appName: "MicroAssure",
  countryCode: "GX",
  currency: "$",
  chatAvatar: require("../../images/chat-avatar-sg.png"),
  policies,
  coverages,
  questionSets,
  claimQuestionSets,
  colors,
  validations,
  termsOfUseHTML,
  parseAppId: "microumbrella",
  parseServerURL: "https://api-dev.microumbrella.com/parse",
  appseeId: "ef742ddea5f2473d8be211c148216f20",
  screens,
  controllers
};
export default appOptions;
