import MockStorage from "./MockStorage";

const storageCache = {};
const AsyncStorage = new MockStorage(storageCache);

jest.setMock("AsyncStorage", AsyncStorage);

import "isomorphic-fetch";
import { getCountryCode, COUNTRY_CODE_KEY } from "../src/models/localization";

it("gets country code", () => {
  return getCountryCode().then(countryCode => {
    // console.log("countryCode", countryCode);
    return AsyncStorage.removeItem(COUNTRY_CODE_KEY);
  });
});

it("gets country code from cache", () => {
  let countryCode1;
  return getCountryCode()
    .then(_countryCode1 => {
      countryCode1 = _countryCode1;
      return AsyncStorage.getItem(COUNTRY_CODE_KEY);
    })
    .then(response => {
      expect(response).toEqual(countryCode1);
      return getCountryCode();
    })
    .then(countryCode2 => {
      expect(countryCode2).toEqual(countryCode1);
      return countryCode2;
    });
});
