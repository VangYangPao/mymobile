// @flow

import RNFS from "react-native-fs";
import Parse from "parse/react-native";
import { Answers } from "react-native-fabric";
import { getMimeType } from "../utils";

export function saveNewDocument(imageProp, imageIndex, uri) {
  return RNFS.readFile(uri, "base64")
    .then(imageBase64 => {
      const fileExt = uri.split(".").pop();
      const mimetype = getMimeType(fileExt);
      const filename = `${imageProp}-${imageIndex + 1}`;
      const filepath = `${filename}.${fileExt}`;
      const file = new Parse.File(filepath, { base64: imageBase64 }, mimetype);
      return {
        file,
        name: filename,
        ext: fileExt
      };
    })
    .then(doc => {
      return doc.file.save().then(file => {
        const { name, ext } = doc;
        return { name, ext, file };
      });
    });
}

export function saveNewClaim(
  policyTypeId: string,
  claimAnswers: any,
  purchase: any,
  answersWithImages: Array<string>,
  user: any
) {
  let answerKeys = [];
  claimAnswers = Object.assign({}, claimAnswers);
  let documents = [];
  answersWithImages.forEach(answerKey => {
    const answerDocuments = claimAnswers[answerKey];
    Array.prototype.push.apply(documents, answerDocuments);
  });
  const Claim = Parse.Object.extend("Claim");
  const claim = new Claim();
  const fields = [
    "accidentType",
    "accidentDate",
    "accidentCause",
    "accidentLocation",
    "details",
    "hasOtherInsuranceCoverage",
    "otherInsuranceCo",
    "otherPolicyNo",
    "recurrence",
    "recurrenceDetail"
  ];
  fields.forEach(field => {
    if (claimAnswers[field]) {
      claim.set(field, claimAnswers[field]);
      delete claimAnswers[field];
    }
  });
  claim.setACL(new Parse.ACL(user));
  claim.set("policyTypeId", policyTypeId);
  claim.set("purchase", purchase);
  claim.set("documents", documents);
  Answers.logCustom(JSON.stringify(documents));

  const { claimFromPolicyholder } = claimAnswers;

  if (claimFromPolicyholder) {
    const fields = [
      "claimFromPolicyholder",
      "claimantFirstName",
      "claimantLastName",
      "claimantIdType",
      "claimantIdNo",
      "claimantPhone",
      "claimantEmail",
      "claimantAddress"
    ];
    fields.forEach(field => {
      if (claimAnswers[field]) {
        claim.set(field, claimAnswers[field]);
        delete claimAnswers[field];
      }
    });
  }
  claim.set("claimAnswers", claimAnswers);
  return claim.save();
}
