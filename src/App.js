import React, { Component } from "react";
import { AppRegistry } from "react-native";
import { MicroUmbrellaApp, getCountryCode } from "microumbrella-core";
import SG_APP_OPTIONS from "./SGApp";
import MY_APP_OPTIONS from "./MYApp";

const appMapping = {
  SG: SG_APP_OPTIONS,
  MY: MY_APP_OPTIONS
};

const DEFAULT_COUNTRY_CODE = "SG";

function getAppOptions() {
  return getCountryCode()
    .then(countryCode => {
      let appOptions = appMapping[countryCode];
      if (!appOptions) {
        appOptions = appMapping[DEFAULT_COUNTRY_CODE];
      }
      return appOptions;
    })
    .catch(err => {
      console.error(err);
    });
}

const App = () => <MicroUmbrellaApp appOptions={getAppOptions} />;

AppRegistry.registerComponent("Microsurance", () => App);
