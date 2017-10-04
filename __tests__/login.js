import Helper from "./Helper";

const helper = new Helper();
beforeEach(() => helper.setup());
afterEach(() => helper.teardown());

it("logs in", () => {
  return helper.driver
    .elementByAccessibilityId("Greet")
    .tap()
    .waitForElementById("Hello World!");
});
