import wd from "wd";

export default class Helper {
  setup() {
    const capabilities = {
      browserName: "",
      "appium-version": "1.6",
      platformName: "iOS",
      deviceName: "iPhone 6",
      platformVersion: "10.2",
      appiumVersion: "1.5.2",
      app: "ios/build/Build/Products/Debug-iphonesimulator/Microsurance.app"
    };
    this.driver = wd.promiseChainRemote({ host: "localhost", port: 4723 });
    return this.driver.init(capabilities);
  }

  teardown() {
    return this.driver.quit();
  }
}
