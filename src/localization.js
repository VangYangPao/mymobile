import { AsyncStorage } from "react-native";
import { COUNTRY_CODE as COUNTRY_CODE_ENV } from "react-native-dotenv";

export const COUNTRY_CODE_KEY = "MU_COUNTRY_CODE";

function fetchCountryCode() {
  var url = "https://freegeoip.net/json/";
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.country_code;
    });
}

function cacheCountryCode(countryCode) {
  return AsyncStorage.setItem(COUNTRY_CODE_KEY, countryCode);
}

export function getCountryCode() {
  if (COUNTRY_CODE_ENV === "QUERY") {
    // return AsyncStorage.getItem(COUNTRY_CODE_KEY).then(response => {
    //   if (response) {
    //     return response;
    //   }
    return fetchCountryCode().then(cacheCountryCode);
    // });
  }

  return new Promise((resolve, reject) => {
    resolve(COUNTRY_CODE_ENV);
  });
}

// export function getCountryCode() {
//   return fetchCountryCode();
// }
