// @flow
import React, { Component } from "react";
import {
  ToastAndroid,
  Alert,
  Platform,
  PixelRatio,
  Dimensions
} from "react-native";
import { Crashlytics } from "react-native-fabric";
import promiseRetry from "promise-retry";

export function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function crashlyticsLogError(err: Error) {
  if (Platform.OS === "android") {
    Crashlytics.logException(err.message + ": " + err.stack);
  } else {
    Crashlytics.recordError(err.message + ": " + err.stack);
  }
}

export function objectToUrlParams(data: any): string {
  return Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join("&");
}

let pixelRatio = PixelRatio.get();
let windowDimensions = Dimensions.get("window");

export function normalize(size) {
  let normalized;
  switch (true) {
    case pixelRatio < 1.4:
      normalized = size * 0.8;
      break;
    case pixelRatio < 2.4:
      normalized = size * 1.15;
      break;
    case pixelRatio < 3.4:
      normalized = size * 1.35;
      break;
    default:
      normalized = size * 1.5;
  }
  return PixelRatio.roundToNearestPixel(normalized);
}

export function normalizeFont(size) {
  const { height, width } = windowDimensions;
  if (pixelRatio < 1.4) {
    return PixelRatio.roundToNearestPixel(
      Math.sqrt(height * height + width * width) * (size / 175)
    );
  }
  return PixelRatio.roundToNearestPixel(
    Math.sqrt(height * height + width * width) * (size / 100)
  );
}

export function getMimeType(fileExt) {
  const DEFAULT_MIMETYPE = "image/jpeg";
  const mimetypeMap = {
    "image/gif": ["gif"],
    "image/jpeg": ["jpeg", "jpg", "jpe"],
    "image/png": ["png"]
  };
  const mimetypes = Object.keys(mimetypeMap);
  for (let i = 0; i < mimetypes.length; i++) {
    const mimetype = mimetypes[i];
    const fileExtensions = mimetypeMap[mimetype];
    if (fileExtensions.indexOf(fileExt) !== -1) {
      return mimetype;
    }
  }
  return DEFAULT_MIMETYPE;
}

const PROMISE_RETRY_OPTIONS = {
  retries: 5,
  factor: 1.5,
  minTimeout: 1000
};

export function createPromiseRetry(func) {
  return (...args) => {
    return promiseRetry((retry, number) => {
      console.log(`${func.name} retry ${number}`);
      const promise = func(...args);
      return promise.catch(retry);
    }, PROMISE_RETRY_OPTIONS); //.then(resolve, reject);
  };
}

export function getObjectFromUrlParams(query) {
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function getDateStr(datetime: Date) {
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const year = datetime.getFullYear();
  let hour = datetime.getHours();
  const minute = datetime.getMinutes();
  let meridien;
  if (hour > 12) {
    meridien = "PM";
    hour -= 12;
  } else {
    meridien = "AM";
  }
  const dateStr = `${hour}:${pad(minute, 2)} ${meridien} ${pad(day, 2)}-${pad(
    month,
    2
  )}-${year}`;
  return dateStr;
}

export function addCommas(nStr) {
  nStr += "";
  x = nStr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

export function prettifyCamelCase(str) {
  var output = "";
  var len = str.length;
  var char;

  for (var i = 0; i < len; i++) {
    char = str.charAt(i);

    if (i == 0) {
      output += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      output += " " + char;
    } else if (char == "-" || char == "_") {
      output += " ";
    } else {
      output += char;
    }
  }

  return output;
}

export function showAlert(text, cb) {
  if (Platform.OS === "ios") {
    Alert.alert(text, null, [
      {
        text: "OK",
        onPress: cb
      }
    ]);
  } else {
    ToastAndroid.show(text, ToastAndroid.LONG);
    if (typeof cb === "function") cb();
  }
}

export function generateID(len: number = 6) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function retry(maxRetries: number, fn: Function) {
  return fn().catch(function(err) {
    if (maxRetries <= 0) {
      throw err;
    }
    return retry(maxRetries - 1, fn);
  });
}
