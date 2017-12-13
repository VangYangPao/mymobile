// @flow

import RNFS from "react-native-fs";
import Parse from "parse/react-native";
import { Answers } from "react-native-fabric";

export function saveDocument(imageProp, imageIndex, uri) {
  return RNFS.readFile(uri, "base64")
    .then(base64 => {
      const fileExt = uri.split(".").pop();
      const filename = `${imageProp}-${imageIndex}`;
      const filepath = `${filename}.${fileExt}`;
      const file = new Parse.File(filename, { base64: imageBase64 });
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

  const answerPromises = answersWithImages.map(answerKey => {
    const claimAnswer = claimAnswers[answerKey];
    const imageProps = Object.keys(claimAnswer);
    answerKeys.push(imageProps);
    const imagePromises = imageProps.map(imageProp => {
      const imageUris = claimAnswer[imageProp];
      if (imageUris === null) return null;
      const bitmapPromises = imageUris.map(uri => RNFS.readFile(uri, "base64"));
      return Promise.all(bitmapPromises);
    });
    return Promise.all(imagePromises);
  });

  return Promise.all(answerPromises)
    .then((imageAnswers, answerIdx) => {
      let documents = [];
      console.log("start create base64");

      imageAnswers.forEach((imageSets, answerIdx) => {
        const answerProp = answersWithImages[answerIdx];
        imageSets.forEach((imageBitmaps, imageSetIdx) => {
          if (!imageBitmaps) return;
          imageBitmaps.forEach((imageBase64, imageBitmapIdx) => {
            const imageProp = answerKeys[answerIdx][imageSetIdx];
            const currentFileName =
              claimAnswers[answerProp][imageProp][imageBitmapIdx];
            if (currentFileName === null) return; // leave it as null
            const fileExt = currentFileName.split(".").pop();
            const filename = `${imageProp}-${imageBitmapIdx + 1}`;
            const filepath = `${filename}.${fileExt}`;
            const file = new Parse.File(filename, { base64: imageBase64 });
            const document = {
              file,
              name: filename,
              ext: fileExt
            };
            documents.push(document);
          });
        });
        delete claimAnswers[answerProp];
      });
      console.log("end create base64");

      return documents;
    })
    .then(documents => {
      console.log("start save file");
      const promises = documents.map(doc => {
        console.log(doc.name);
        return doc.file.save().then(file => {
          const { name, ext } = doc;
          console.log("save " + name);
          return { file, name, ext };
        });
      });
      return Promise.all(promises);
    })
    .then(documents => {
      console.log("end save file");
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
    });
}
