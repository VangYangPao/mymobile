import * as cheerio from "cheerio";
import { sha512 } from "js-sha512";
import moment from "moment";

import { objectToUrlParams, getObjectFromUrlParams } from "./utils";

const PAYMENT_PROCESS_URL =
  "https://test.wirecard.com.sg/easypay2/paymentprocess.do";
const SALE_STATUS_URL = "https://shell-club.glitch.me/status";
const cur = "SGD";
const mid = "20151111011";
const securityKey = "ABC123456";
const API_VERSION = 2;

export function generateRef() {
  const now = new Date();
  return "WT" + moment(now).format("DDMMYYHHmm");
}

export function generateValidity() {
  const now = new Date();
  const fiveMinsLater = new Date(now.getTime() + 5 * 60000);
  return moment(fiveMinsLater).format("YYYY-MM-DD-HH:mm:SS");
}

function generateFormData(payload) {
  let formData = new FormData();
  for (var key in payload) {
    if (payload.hasOwnProperty(key)) {
      // formData.append(key, encodeURIComponent(payload[key]));
      formData.append(key, payload[key]);
    }
  }
  return formData;
}

export function verifyEnrolment(cardDetails, paytype, amt) {
  const ref = generateRef();
  const validity = generateValidity();
  const transtype = "vereq";
  const securitySeq = amt + ref + cur + mid + transtype + securityKey;
  const signature = sha512(securitySeq);
  const payload = {
    mid,
    ref,
    transtype,
    cur,
    amt,
    signature,
    validity,
    paytype,
    ccnum: cardDetails.ccnum,
    ccdate: cardDetails.ccdate,
    cccvv: cardDetails.cccvv,
    returnurl: "http://microumbrella.com",
    version: API_VERSION
  };
  // const params = console.log(
  //   `${PAYMENT_PROCESS_URL}/${objectToUrlParams(payload)}`
  // );
  const formData = generateFormData(payload);

  return fetch(PAYMENT_PROCESS_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .catch(err => {
      throw err;
    })
    .then(resStr => {
      const res = getObjectFromUrlParams(resStr);
      if (res.TM_Status === "NO") {
        throw new Error(JSON.stringify(res));
      }
      return res;
    })
    .catch(err => {
      throw err;
    });
}

export function acsRedirection(acsUrl, PaReq, TermUrl, MD) {
  const payload = { PaReq, TermUrl, MD };
  const params = objectToUrlParams(payload);
  const formData = generateFormData(payload);
  return fetch(acsUrl, {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .catch(err => {
      throw err;
    });
}

export function performPaymentAuthRequest(ref, amt, pares) {
  const validity = generateValidity();
  const transtype = "pares";
  const securitySeq = amt + ref + cur + mid + transtype + securityKey;
  const signature = sha512(securitySeq);
  let payload = {
    mid,
    ref,
    cur,
    amt,
    pares,
    ref,
    transtype,
    subtranstype: "vereq",
    md: ref,
    signature,
    validity,
    version: API_VERSION
  };
  const formData = generateFormData(payload);
  return fetch(PAYMENT_PROCESS_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .catch(err => {
      throw err;
    })
    .then(resStr => {
      const res = getObjectFromUrlParams(resStr);
      if (res.TM_Status === "NO") {
        throw new Error(JSON.stringify(res));
      }
      return res;
    })
    .catch(err => {
      throw err;
    });
}

export function create3dsAuthorizationRequest(
  cardDetails,
  ref,
  paytype,
  threeDSStatus,
  amt,
  eci,
  /*  For enrolled cards, the value is based on TM_ECI field in Payment Authentication (Response)
    For non-enrolled cards, the value is based on TM_ECI field in Verify Enrollment (Response) */
  cavv, // The value is based on TM_CAVV field in Payment Authentication (Response)
  xid // The value is based on TM_XID field in Payment Authentication (Response)
) {
  const validity = generateValidity();
  const transtype = "SALE";
  const securitySeq = amt + ref + cur + mid + transtype + securityKey;
  const signature = sha512(securitySeq);
  const { ccnum, ccdate, cccvv } = cardDetails;
  let payload = {
    mid,
    ref,
    cur,
    amt,
    transtype,
    paytype,
    ccnum,
    ccdate,
    cccvv,
    "3dsstatus": threeDSStatus,
    // returnurl: "http://microumbrella.com",
    signature,
    validity,
    version: API_VERSION
  };
  if (threeDSStatus !== "CNE") {
    payload["eci"] = eci;
    payload["cavv"] = encodeURIComponent(cavv);
    payload["xid"] = xid;
  }
  console.log(payload);
  const formData = generateFormData(payload);
  return fetch(PAYMENT_PROCESS_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(resStr => {
      const res = getObjectFromUrlParams(resStr);
      if (res.TM_Status === "NO") {
        throw new Error(JSON.stringify(res));
      }
      return res;
    })
    .catch(err => {
      throw err;
    });
}

export function doFull3DSTransaction(cardDetails, paytype, amtFloat) {
  let ref;
  const amt = amtFloat.toFixed(2);
  return verifyEnrolment(cardDetails, paytype, amt)
    .then(res => {
      const { Acsurl, PaReq, TM_RefNo } = res;
      ref = TM_RefNo;
      console.log("verified enrolment");
      return acsRedirection(
        Acsurl,
        PaReq,
        "http://microumbrella.com/term",
        TM_RefNo
      );
    })
    .catch(err => {
      console.error("verify enrolment", err);
    })
    .then(html => {
      console.log("acs redirected");
      const $ = cheerio.load(html);
      const PaRes = $('input[name="PaRes"]').val();
      return performPaymentAuthRequest(ref, amt, PaRes);
    })
    .catch(err => {
      console.error("payment authentication", err);
    })
    .then(res => {
      const { TM_3DSStatus, TM_ECI, TM_CAVV, TM_XID } = res;
      console.log("payment authenticated");
      return create3dsAuthorizationRequest(
        cardDetails,
        ref,
        paytype,
        TM_3DSStatus,
        amt,
        TM_ECI,
        TM_CAVV,
        TM_XID
      );
    })
    .catch(err => {
      console.error("3DS", err);
    })
    .then(res => {
      console.log("3DS sale done");
      return res;
    });
}

export function createEasyPaySaleURL(amtFloat) {
  const url = "https://test.wirecard.com.sg/easypay2/paymentpage.do";
  const amt = amtFloat.toFixed(2);
  const now = new Date();
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
