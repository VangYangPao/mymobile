import "react-native";
import "isomorphic-fetch";
import "isomorphic-form-data";
import * as cheerio from "cheerio";

import {
  generateRef,
  generateValidity,
  verifyEnrolment,
  acsRedirection,
  performPaymentAuthRequest,
  doFull3DSTransaction
} from "../src/telemoney";

// it("verifies enrolment correctly", () => {
//   verifyEnrolment(2, 10.0)
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.error("verify enrolment", err);
//     });
// });

// it("does acs redirection correctly", () => {
//   verifyEnrolment(2, 10.0)
//     .then(res => {
//       const { Acsurl, PaReq, TM_RefNo } = res;
//       console.log(res);
//       return acsRedirection(Acsurl, PaReq, "microumbrella.com/term", TM_RefNo);
//     })
//     .catch(err => {
//       console.error("verify enrolment", err);
//     })
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.error("acs redirection", err);
//     });
// });

// it("does payment authentication correctly", () => {
//   const paytype = 3;
//   const amt = 10.0;

//   let ref;
//   return verifyEnrolment(paytype, amt)
//     .then(res => {
//       const { Acsurl, PaReq, TM_RefNo } = res;
//       ref = TM_RefNo;
//       console.log("verified enrolment");
//       return acsRedirection(
//         Acsurl,
//         PaReq,
//         "http://microumbrella.com/term",
//         TM_RefNo
//       );
//     })
//     .catch(err => {
//       console.error("verify enrolment", err);
//     })
//     .then(html => {
//       console.log("acs redirected");
//       console.log(html);
//       const $ = cheerio.load(html);
//       const PaRes = $('input[name="PaRes"]').val();
//       return performPaymentAuthRequest(ref, amt, PaRes);
//     })
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.error("payment authentication", err);
//     });
// });

it("does 3DS authorization correctly", () => {
  const paytype = 2;
  const amt = 10.0;

  doFull3DSTransaction(paytype, amt)
    .then(res => console.log(res))
    .catch(err => {
      throw err;
    });
});
