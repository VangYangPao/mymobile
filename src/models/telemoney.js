// @flow
import { sha512 } from "js-sha512";
import moment from "moment";

import { objectToUrlParams, getObjectFromUrlParams } from "../utils";

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

type CardDetails = {
  ccnum: string,
  ccdate: string,
  cccvv: string,
  ccname: string
};

export function verifyEnrolment(
  ref: string,
  cardDetails: CardDetails,
  paytype: number,
  amt: string
) {
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
    paytype,
    ccnum: cardDetails.ccnum,
    ccdate: cardDetails.ccdate,
    cccvv: cardDetails.cccvv,
    version: API_VERSION,
    signature,
    validity
  };
  // console.log(payload);
  const formData = generateFormData(payload);

  return (
    fetch(PAYMENT_PROCESS_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      // .catch(err => {
      //   throw err;
      // })
      .then(resStr => {
        const res = getObjectFromUrlParams(resStr);
        if (res.TM_Status === "NO") {
          throw new Error(JSON.stringify(res));
        }
        return res;
      })
  );
}

export function acsRedirection(
  acsUrl: string,
  PaReq: string,
  TermUrl: string,
  MD: string
) {
  const payload = { PaReq, TermUrl, MD };
  const params = objectToUrlParams(payload);
  const formData = generateFormData(payload);
  return fetch(acsUrl, {
    method: "POST",
    body: formData
  }).then(res => res.text());
  // .catch(err => {
  //   throw err;
  // });
}

export function performPaymentAuthRequest(
  ref: string,
  amt: string,
  pares: string
) {
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
  return (
    fetch(PAYMENT_PROCESS_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      // .catch(err => {
      //   throw err;
      // })
      .then(resStr => {
        const res = getObjectFromUrlParams(resStr);
        if (res.TM_Status === "NO") {
          console.log("pass");
          throw new Error(JSON.stringify(res));
        }
        return res;
      })
  );
  // .catch(err => {
  //   throw err;
  // });
}

export function create3dsAuthorizationRequest(
  cardDetails: CardDetails,
  ref: string,
  paytype: number,
  threeDSStatus: string,
  amt: string,
  eci: string,
  /*  For enrolled cards, the value is based on TM_ECI field in Payment Authentication (Response)
    For non-enrolled cards, the value is based on TM_ECI field in Verify Enrollment (Response) */
  cavv: string, // The value is based on TM_CAVV field in Payment Authentication (Response)
  xid: string // The value is based on TM_XID field in Payment Authentication (Response)
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
    returnurl: SALE_STATUS_URL,
    // recurrentid: "INIT",
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
    });
  // .catch(err => {
  //   throw err;
  // });
}

export function doFull3DSTransaction(
  cardDetails: CardDetails,
  paytype: number,
  amtFloat: number,
  verifyEnrolmentResponse: any,
  renderACSUrl: Function
) {
  let ref: string;
  const amt = amtFloat.toFixed(2);

  let promise;
  if (verifyEnrolmentResponse) {
    promise = new Promise(resolve => resolve(verifyEnrolmentResponse));
  } else {
    ref = generateRef();
    promise = verifyEnrolment(ref, cardDetails, paytype, amt);
  }
  return (
    promise
      .then(res => {
        const {
          Acsurl,
          PaReq,
          TM_RefNo
        }: { Acsurl: string, PaReq: string, TM_RefNo: string } = res;
        ref = TM_RefNo;
        console.log("verified enrolment");
        return acsRedirection(
          Acsurl,
          PaReq,
          "http://microumbrella.com/term",
          ref
        );
      })
      // .catch(err => {
      //   console.error("verify enrolment", err);
      // })
      .then(renderACSUrl)
      .then(PaRes => {
        console.log("acs redirected");
        // render html in webview
        // redirect to TermUrl
        // detect redirection, perform payment auth
        // const $ = cheerio.load(html);
        // const PaRes = $('input[name="PaRes"]').val();
        return performPaymentAuthRequest(ref, amt, PaRes);
      })
      // .catch(err => {
      //   console.error("payment authentication", err);
      // })
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
      // .catch(err => {
      //   console.error("3DS", err);
      // })
      .then(res => {
        console.log("3DS sale done");
        return res;
      })
  );
}
