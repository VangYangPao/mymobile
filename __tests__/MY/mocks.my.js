// @flow
import "../mocks";

import { MY as secrets } from "../../secrets/secrets";

import Parse from "parse/react-native";
Parse.initialize(secrets.appName);
Parse.serverURL = secrets.serverURL;
Parse.masterKey = secrets.masterKey;
Parse.Cloud.useMasterKey();
