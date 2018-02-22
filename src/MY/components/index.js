// @flow
import CoverageAddonPicker from "./CoverageAddonPicker";
import baseTableInputs from "../../../microumbrella-core/src/components/base-table-inputs";
import PersonalDetailsTableInput from "./PersonalDetailsTableInput";

export default {
  chatWidgets: {
    responseTypes: {
      coverageAddon: CoverageAddonPicker
    }
  },
  tableInputs: {
    ...baseTableInputs,
    personalDetails: PersonalDetailsTableInput
  }
};
