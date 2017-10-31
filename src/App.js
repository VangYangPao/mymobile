import { AppRegistry } from "react-native";
import createMicroUmbrellaApp from "../microumbrella-core/createMicroUmbrellaApp";

AppRegistry.registerComponent("Microsurance", () =>
  createMicroUmbrellaApp({
    parseAppId: "microumbrella",
    parseServerURL: "https://api-dev.microumbrella.com/parse"
  })
);
