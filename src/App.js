// @flow
import React, { Component } from "react";
import { AppRegistry, View, Text } from "react-native";
import { getCountryCode } from "./localization";
import SG_APP_OPTIONS from "./SG/options";
import MY_APP_OPTIONS from "./MY/options";

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

class MicroUmbrellaApp extends Component {
  MicroUmbrellaApp: ?Component;
  appOptions: Object;
  state: {
    loadingCountry: boolean
  };

  constructor(props: {}) {
    super(props);
    this.state = { loadingCountry: true };
    this.MicroUmbrellaApp = null;
    this.appOptions = null;
  }

  componentWillMount() {
    getCountryCode().then(countryCode => {
      let appOptions = appMapping[countryCode];
      if (!appOptions) {
        appOptions = appMapping[DEFAULT_COUNTRY_CODE];
      }
      this.appOptions = appOptions;
      if (countryCode === "SG") {
        this.MicroUmbrellaApp = require("../microumbrella-core-sg").MicroUmbrellaApp;
      } else {
        this.MicroUmbrellaApp = require("../microumbrella-core").MicroUmbrellaApp;
      }
      this.setState({ loadingCountry: false });
    });
  }

  render() {
    if (!this.state.loadingCountry) {
      return <this.MicroUmbrellaApp appOptions={this.appOptions} />;
    }
    return <View />;
  }
}

const App = () => <MicroUmbrellaApp />;

AppRegistry.registerComponent("Microsurance", () => App);
