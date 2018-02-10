// @flow
import "./mocks";
import {
  testSaveNewAccidentPurchase,
  testSaveNewAccidentMRPurchase,
  testSaveNewAccidentWIPurchase,
  testSaveNewTravelPurchase,
  testSaveNewMobilePurchase
} from "./parse-functions";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("saves new accident purchase vanilla", () => {
  expect.assertions(3);
  let purchase;
  return testSaveNewAccidentPurchase()
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
      purchase = res.get("purchaseId");
      return res.destroy();
    })
    .then(() => {
      return purchase.destroy();
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new accident purchase mr", () => {
  expect.assertions(3);
  let purchase;
  return testSaveNewAccidentMRPurchase()
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
      purchase = res.get("purchaseId");
      return res.destroy();
    })
    .then(() => {
      return purchase.destroy();
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new accident purchase wi", () => {
  expect.assertions(3);
  let purchase;
  return testSaveNewAccidentWIPurchase()
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseAccident");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
      purchase = res.get("purchaseId");
      return res.destroy();
    })
    .then(() => {
      return purchase.destroy();
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new travel purchase", () => {
  expect.assertions(3);
  let purchase;
  return testSaveNewTravelPurchase()
    .then(res => {
      expect(res).toHaveProperty("className", "PurchaseTravel");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
      purchase = res.get("purchaseId");
      return res.destroy();
    })
    .then(() => {
      return purchase.destroy();
    })
    .catch(err => {
      console.error(err);
    });
});

it("saves new phone purchase", () => {
  expect.assertions(3);
  let purchase;
  return testSaveNewMobilePurchase()
    .then(res => {
      expect(res).toHaveProperty("className", "PurchasePhone");
      expect(res).toHaveProperty("_objCount");
      expect(res).toHaveProperty("id");
      purchase = res.get("purchaseId");
      return res.destroy();
    })
    .then(() => {
      return purchase.destroy();
    })
    .catch(err => {
      console.error(err);
    });
});
