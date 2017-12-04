// @flow

import RNFS from "react-native-fs";
import Parse from "parse/react-native";

export function saveNewClaim(
  policyTypeId: string,
  claimAnswers: any,
  purchase: any,
  answersWithImages: Array<string>,
  user: any
) {
  let answerKeys = [];
  claimAnswers = Object.assign({}, claimAnswers);

  const answerPromises = answersWithImages.map(answerKey => {
    const claimAnswer = claimAnswers[answerKey];
    const imageProps = Object.keys(claimAnswer);
    answerKeys.push(imageProps);
    const imagePromises = imageProps.map(imageProp => {
      const imageUris = claimAnswer[imageProp];
      if (imageUris === null) return null;
      return imageUris.map(uri => RNFS.readFile(uri, "base64"));
    });
    return Promise.all(imagePromises);
  });

  return Promise.all(answerPromises).then((imageAnswers, answerIdx) => {
    let documents = [];

    imageAnswers.forEach((imageSets, answerIdx) => {
      const answerProp = answersWithImages[answerIdx];
      imageSets.forEach((imageBitmaps, imageSetIdx) => {
        if (!imageBitmaps) return;
        imageBitmaps.forEach((imageBase64, imageBitmapIdx) => {
          const imageProp = answerKeys[answerIdx][imageSetIdx];
          console.log(answerProp, imageProp);
          const currentFileName = claimAnswers[answerProp][imageProp];
          if (currentFileName === null) return; // leave it as null
          const fileExt = currentFileName.split(".").pop();
          const filename = `${imageProp}-${imageBitmapIdx + 1}.${fileExt}`;
          const file = new Parse.File(filename, { base64: imageBase64 });
          const document = {
            file,
            name: imageProp,
            ext: fileExt
          };
          documents.push(document);
        });
      });
      delete claimAnswers[answerProp];
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
  });
}
