import "./mocks";
import Parse from "parse/react-native";

import { generateID } from "../src/utils";
import { saveNewPurchase } from "../src/parse/purchase";
import { saveNewClaim } from "../src/parse/claims";
import { connectSFTP, transformClaimToExcelRow } from "../cloud-code/sftp";

Parse.initialize("microumbrella");
Parse.serverURL =
  process.env.NODE_ENV === "dev"
    ? "https://api-dev.microumbrella.com/parse"
    : "http://localhost:1337/parse";

// it("connects HLAS SFTP successfully", () => {
//   return connectSFTP();
// });

it("adds new claim to Excel file", () => {
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
    testing: "123",
    claimFromPolicyholder: false,
    claimantFirstName: "test",
    claimantLastName: "test",
    claimantIdType: 1,
    claimantIdNo: "S888G",
    claimantPhone: "888",
    claimantEmail: "x@a.com"
  };
  let subPurchase, purchase;

  return Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(user => {
      return saveNewPurchase(
        policyTypeId,
        pasAppId,
        policyId,
        webAppId,
        premium,
        planId,
        optionId,
        autoRenew,
        user,
        tmTxnRef,
        tmVerifyEnrolment,
        tmPaymentSuccessRes,
        additionalAttributes
      );
      7;
    })
    .then(_subPurchase => {
      subPurchase = _subPurchase;
      purchase = subPurchase.get("purchaseId");
      const policyTypeId = purchase.get("policyTypeId");
      return saveNewClaim(policyTypeId, claimAnswers, purchase, [
        "images",
        "travelImages"
      ]);
    })
    .then(claim => {
      console.log(transformClaimToExcelRow(claim));
      return claim.destroy();
    })
    .then(() => {
      return subPurchase.destroy();
    })
    .then(() => {
      return purchase.destroy();
    });
});
