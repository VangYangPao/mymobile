// @flow
import React, { Component } from "react";
import AppStore from "../../../microumbrella-core/stores/AppStore";
import { TableInput } from "../../../microumbrella-core/src/components/chatWidgets";

import type { QuestionTableColumnType } from "../../../types/app";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

type TableInputNavigationState = {
  params: Object
};
type TableInputNavigation = NavigationScreenProp<TableInputNavigationState, *>;

export default function PersonalDetailsTableInput({
  columns,
  onSubmit,
  navigation
}: {
  columns: Array<QuestionTableColumnType>,
  onSubmit: (items: Array<Object>) => void,
  navigation: TableInputNavigationState
}) {
  const isNotMYApp = AppStore.countryCode !== "MY";

  const renderItemText = item => {
    let fullName;
    if (isNotMYApp) {
      const { firstName, lastName } = item;
      fullName = `${firstName} ${lastName}`;
    } else {
      fullName = item.fullName;
    }
    return fullName;
  };

  return (
    <TableInput
      validate={() => {}}
      renderItemText={renderItemText}
      screenTitle="Add Personal Details"
      addButtonText="ADD PERSONAL DETAILS"
      sendButtonText="SEND"
      sendButtonTextWhenEmpty={null}
      columns={columns}
      onSubmit={onSubmit}
      navigation={navigation}
    />
  );
}
