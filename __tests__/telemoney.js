import "react-native";
import "isomorphic-fetch";
import "isomorphic-form-data";
import * as cheerio from "cheerio";
import "./mocks";
import { createPromiseRetry } from "../src/utils";

import {
  generateRef,
  generateValidity,
  verifyEnrolment,
  acsRedirection,
  performPaymentAuthRequest,
  doFull3DSTransaction,
  tokenizeTransaction
} from "../microumbrella-core-sg/src/models/telemoney";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const CARDS = {
  "2": {
    ccnum: "5453010000064154",
    ccdate: "2101",
    cccvv: "123",
    ccname: "Chan"
  },
  "3": {
    ccnum: "4005550000000001",
    ccdate: "2101",
    cccvv: "602",
    ccname: "Chan"
  }
};

// it("verifies enrolment correctly", () => {
//   const amt = Math.floor(Math.random() * 100) + 1;
//   let paytype;
//   for (let i = 0; i < 10; i++) {
//     paytype = i % 2 === 0 ? 2 : 3;
//     verifyEnrolment(CARDS[paytype], paytype, amt.toFixed(2))
//       .then(res => {
//         // console.log(res);
//       })
//       .catch(err => {
//         console.error("verify enrolment", err);
//       });
//   }
// });

// it("does acs redirection correctly", () => {
//   const amt = Math.floor(Math.random() * 100) + 1;
//   let paytype;
//   for (let i = 0; i < 10; i++) {
//     paytype = i % 2 === 0 ? 2 : 3;
//     verifyEnrolment(CARDS[paytype], paytype, amt)
//       .then(res => {
//         const { Acsurl, PaReq, TM_RefNo } = res;
//         // console.log(res);
//         return acsRedirection(
//           Acsurl,
//           PaReq,
//           "http://microumbrella.com/term",
//           TM_RefNo
//         );
//       })
//       .catch(err => {
//         console.error("verify enrolment", err);
//       })
//       .then(res => {
//         // console.log(res);
//       })
//       .catch(err => {
//         console.error("acs redirection", err);
//       });
//   }
// });

// it("does payment authentication correctly", () => {
//   const amt = Math.floor(Math.random() * 100) + 1;
//   let paytype;

//   for (let i = 0; i < 10; i++) {
//     paytype = i % 2 === 0 ? 2 : 3;
//     let ref;
//     return verifyEnrolment(CARDS[paytype], paytype, amt)
//       .then(res => {
//         const { Acsurl, PaReq, TM_RefNo } = res;
//         ref = TM_RefNo;
//         console.log("verified enrolment");
//         return acsRedirection(
//           Acsurl,
//           PaReq,
//           "http://microumbrella.com/term",
//           TM_RefNo
//         );
//       })
//       .catch(err => {
//         console.error("verify enrolment", err);
//       })
//       .then(html => {
//         console.log("acs redirected");
//         // console.log(html);
//         const $ = cheerio.load(html);
//         const PaRes = $('input[name="PaRes"]').val();
//         return performPaymentAuthRequest(ref, amt, PaRes);
//       })
//       .then(res => {
//         // console.log(res);
//       })
//       .catch(err => {
//         console.error("payment authentication", err);
//       });
//   }
// });

// it("does 3DS authorization correctly", () => {
//   let paytype = 3;

//   for (let i = 0; i < 1; i++) {
//     // const amt = Math.floor(Math.random() * 100) + 1;
//     doFull3DSTransaction(CARDS[paytype], paytype, 11).then(res =>
//       console.log(res)
//     );
//   }
// });

it("does 3DS authorization correctly", () => {
  let paytype = 3;
  const ref = generateRef();

  const p = () => {
    return verifyEnrolment(generateRef(), CARDS[paytype], paytype, "11.00");
  };

  let promises = [];
  let promise;
  const start = new Date().getTime();

  for (let i = 0; i < 1; i++) {
    // const amt = Math.floor(Math.random() * 100) + 1;
    (function(i) {
      promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(
            createPromiseRetry(p)().then(res => {
              return doFull3DSTransaction(CARDS[paytype], paytype, 11, res);
            })
          );
        }, i);
      });
      promises.push(promise);
    })(i);
  }
  return Promise.all(promises).then(results => {
    console.log(new Date().getTime() - start, results);
  });
});

// it("does tokenization of transaction correctly", () => {
//   tokenizeTransaction(CARDS[2], "10.00").catch(err => {
//     console.error(err);
//   });
// });
