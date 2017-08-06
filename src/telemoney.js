import { fetch } from "react-native";
import { sha512 } from "js-sha512";
import moment from "moment";

function objectToUrlParams(data) {
  return Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join("&");
}

const mid = "20151111011";

export function createEasyPaySaleURL(amtFloat) {
  const url = "https://test.wirecard.com.sg/easypay2/paymentpage.do";
  const amt = amtFloat.toFixed(2);
  const now = new Date();
  const fiveMinsLater = new Date(now.getTime() + 5 * 60000);
  const validity = moment(fiveMinsLater).format("YYYY-MM-DD-HH:mm:SS");
  const ref = "WT" + moment(now).format("DDMMYYHHmm");
  const cur = "SGD";
  const transtype = "SALE";
  const securityKey = "ABC123456";
  const securitySeq = amt + ref + cur + mid + transtype + securityKey;
  const signature = sha512(securitySeq);
  const paramString = objectToUrlParams({
    amt,
    validity,
    ref,
    cur,
    mid,
    transtype,
    signature,
    version: 2
  });
  return url + "?" + paramString;
}

export function createEasyPayVoidURL(ref) {
  const url = "https://test.wirecard.com.sg/easypay2/paymentpage.do";
  const paramString = objectToUrlParams({ mid, ref, ack: "YES" });
  return url + "?" + paramString;
}
