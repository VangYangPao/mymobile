// @flow

import RNFS from "react-native-fs";
import Parse from "parse/react-native";

export function saveNewClaim(
  policyTypeId: string,
  claimAnswers: any,
  purchase: any,
  answersWithImages: Array<string>
) {
  let answerKeys = [];

  const answerPromises = answersWithImages.map(answerKey => {
    const claimAnswer = claimAnswers[answerKey];
    const imageProps = Object.keys(claimAnswer);
    answerKeys.push(imageProps);
    const imagePromises = imageProps.map(imageProp => {
      const imageUri = claimAnswer[imageProp];
      if (imageUri === null) return null;
      return RNFS.readFile(imageUri, "base64");
    });
    return Promise.all(imagePromises);
  });

  return Promise.all(answerPromises).then((imageAnswers, answerIdx) => {
    imageAnswers.forEach((imageBitmaps, answerIdx) => {
      imageBitmaps.forEach((imageBase64, imageIdx) => {
        const answerProp = answersWithImages[answerIdx];
        const imageProp = answerKeys[answerIdx][imageIdx];
        const currentFileName = claimAnswers[answerProp][imageProp];
        if (currentFileName === null) return; // leave it as null
        const fileExt = currentFileName.split(".").pop();
        const filename = `${imageProp}.${fileExt}`;
        const file = new Parse.File(filename, { base64: imageBase64 });
        claimAnswers[answerProp][imageProp] = file;
      });
    });
    const Claim = Parse.Object.extend("Claim");
    const claim = new Claim();
    claim.set("policyTypeId", policyTypeId);
    claim.set("claimAnswers", claimAnswers);
    claim.set("purchase", purchase);
    return claim.save();
  });
}
