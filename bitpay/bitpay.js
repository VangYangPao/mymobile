// @flow
import bitauth from "bitauth";

const BITPAY_INVOICE_URL = "https://test.bitpay.com/invoices";
const BITPAY_CLIENT_ID = "TfA4J9R4dctNxF44FSPSWmimNi1tw6oC3sz";
const BITPAY_ACCESS_TOKEN = "B4eLz57d5VJUiFRDyxSJoFQazmHT3G1WcfryxL5CuaQD";
const BITPAY_PUB_KEY =
  "0211f692df246a655d251ba0eb391bc2f74529c65f3a2f782ccea692d87bb27175";
const BITPAY_PRIV_KEY =
  "ddc3060dac459ebf09ad06796224e512ec4fd5e7246544ba0df6d7eece469aee";
const BITPAY_API_VERSION = "2.0.0";
const BITPAY_NOTIFICATION_URL =
  "https://api-dev-my.microumbrella.com/functions/on-bitpay-notifications";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

const POST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "x-identity": BITPAY_PUB_KEY,
  "x-accept-version": BITPAY_API_VERSION
};

type BitpayCurrencyType = "USD" | "BTC";

function createSignature(url: string, body: string) {
  const message = url + body;
  const signature = bitauth.sign(message, BITPAY_PRIV_KEY);
  return signature;
}

function createHeaders(url: string, body: string) {
  const postHeaders = Object.assign({}, POST_HEADERS);
  const signature = createSignature(url, body);
  postHeaders["x-signature"] = signature;
  return postHeaders;
}

export function createInvoice(
  price: number,
  currency: BitpayCurrencyType,
  posData: Object,
  notificationURL: string = BITPAY_NOTIFICATION_URL,
  fullNotifications: boolean = true,
  notificationEmail: boolean = true
) {
  const payload = JSON.stringify({
    price,
    currency,
    posData,
    notificationURL,
    fullNotifications,
    notificationEmail,
    token: BITPAY_ACCESS_TOKEN,
    guid: "" + Math.random()
  });
  const headers = createHeaders(BITPAY_INVOICE_URL, payload);
  return fetch(BITPAY_INVOICE_URL, {
    method: "POST",
    headers,
    body: payload
  }).then(response => {
    return response.json();
  });
}
