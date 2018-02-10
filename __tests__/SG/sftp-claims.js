// @flow
import "./mocks";
import Parse from "parse/react-native";
import Client from "ssh2-sftp-client";

import { generateID } from "../src/utils";
import { saveNewPurchase } from "../src/parse/purchase";
import { saveNewClaim } from "../src/parse/claims";
import {
  backupExistingFiles,
  connectToSFTP,
  transformClaimToExcelRow,
  appendClaimToExcelFile
} from "../cloud-code/claims";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

Parse.initialize("microumbrella");
Parse.serverURL =
  process.env.NODE_ENV === "dev"
    ? "https://api-dev.microumbrella.com/parse"
    : "http://localhost:1337/parse";

// it("connects HLAS SFTP successfully", () => {
//   return connectSFTP();
// });

// jest.mock("ssh2-sftp-client", () => {
//   let fs = require("fs");
//   let path = require("path");

//   function sftpList(dirName) {
//     const dirPath = path.join(process.cwd(), "__tests__", "fixtures", dirName);

//     return new Promise((resolve, reject) => {
//       fs.readdir(dirPath, (err, files) => {
//         if (err) return reject(err);
//         resolve(files);
//       });
//     }).then(files => {
//       return files.map(fileName => {
//         const filePath = path.join(dirPath, fileName);
//         const stats = fs.lstatSync(filePath);
//         return {
//           type: stats.isDirectory() ? "d" : "-",
//           name: fileName
//         };
//       });
//     });
//   }

//   function sftpMkdir(dirName) {}
//   return function Client() {
//     return {
//       connect: () => {},
//       list: sftpList
//     };
//   };
// });

// it("backs up current Excel file & documents", () => {
//   let sftp = new Client();
//   // return sftp.list("Claims").then(res => console.log(res));
//   return connectToSFTP(sftp)
//     .then(() => {
//       return backupExistingFiles(sftp);
//     })
//     .then(() => {
//       return sftp.end();
//     });
// });

it("appends new claim to Excel file", () => {
  const policyTypeId = "pa";
  const pasAppId = generateID();
  const policyId = generateID();
  const webAppId = generateID();
  const premium = 15.0;
  const planId = 100;
  const optionId = 2;
  const policyTermsId = 1;
  const commencementDate = new Date();
  const autoRenew = false;
  const policyholderIdType = 1;
  const policyholderIdNo = "12345";
  const tmTxnRef = generateID();
  const tmVerifyEnrolment = generateID();
  const tmPaymentSuccessRes = generateID();

  const additionalAttributes = {
    policyTermsId,
    commencementDate
  };

  const claimAnswers = {
    images: {
      policeReport: "123.jpg",
      medicalReceipt: "234.png"
    },
    travelImages: {
      policeReport: "123.jpg"
    },
    claimFromPolicyholder: false,
    claimantFirstName: "test",
    claimantLastName: "test",
    claimantIdType: 1,
    claimantIdNo: "S888G",
    claimantPhone: "888",
    claimantEmail: "x@a.com",
    claimantAddress: "Midview City",
    accidentType: "aaa",
    accidentDate: new Date(),
    accidentCause: "aaa",
    accidentLocation: "aaa",
    details: "aaa",
    hasOtherInsuranceCoverage: true,
    otherInsuranceCo: "AIA",
    otherPolicyNo: "AM123",
    recurrence: "aaa",
    recurrenceDetail: "aaa"
  };
  var user, subPurchase, purchase, _claim;

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(_user => {
      user = _user;
      return saveNewPurchase(
        policyTypeId,
        pasAppId,
        policyId,
        webAppId,
        premium,
        planId,
        optionId,
        autoRenew,
        policyholderIdType,
        policyholderIdNo,
        user,
        tmTxnRef,
        tmVerifyEnrolment,
        tmPaymentSuccessRes,
        additionalAttributes
      );
    })
    .then(_subPurchase => {
      subPurchase = _subPurchase;
      purchase = subPurchase.get("purchaseId");
      const policyTypeId = purchase.get("policyTypeId");
      var promises = [1, 2, 3].map(function() {
        return saveNewClaim(
          policyTypeId,
          claimAnswers,
          purchase,
          ["images", "travelImages"],
          user
        );
      });
      return Promise.all(promises);
    })
    .then(claims => {
      const sftp = new Client();
      return connectToSFTP(sftp)
        .then(() => {
          return backupExistingFiles(sftp);
        })
        .then(() => {
          return appendClaimToExcelFile(sftp, claims);
        })
        .then(() => {
          return sftp.end();
        });
    });
  // .then(() => {
  //   return _claim.destroy();
  // })
  // .then(() => {
  //   console.log(subPurchase);
  //   return subPurchase.destroy();
  // })
  // .then(() => {
  //   console.log(purchase);
  //   return purchase.destroy();
  // });
});
