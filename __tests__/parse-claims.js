// @flow
import { generateID } from "../src/utils";

jest.mock("parse/react-native", () => {
  var ParseNode = require("parse/node");
  return ParseNode;
});

jest.mock("react-native-fs", () => {
  var fs = require("fs");
  var path = require("path");

  const readFile = () => {
    return new Promise((resolve, reject) => {
      const fpath = path.join(process.cwd(), "images", "mom.png");
      fs.readFile(fpath, (err, bitmap) => {
        if (err) reject(err);
        const imageBase64 = new Buffer(bitmap).toString("base64");
        resolve(imageBase64);
      });
    });
  };

  return { readFile };
});

import Parse from "parse/react-native";
Parse.initialize("microumbrella");
// Parse.serverURL = "https://api-dev.microumbrella.com/parse";
Parse.serverURL = "http://localhost:1337/parse";

import { saveNewClaim } from "../src/parse/claims";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("makes claim successfully", () => {
  const policyTypeId = "pa";
  const answers = {
    images: {
      policeReport: "123.jpg",
      medicalReceipt: "234.png"
    },
    travelImages: {
      policeReport: "123.jpg"
    },
    testing: "123"
  };
  const imageProps = ["images", "travelImages"];
  const Purchase = Parse.Object.extend("Purchase");
  Parse.User
    .logIn("x@aa.com", "1234abcd")
    .then(currentUser => {
      const query = new Parse.Query(Purchase);
      return query.first();
    })
    .then(purchase => {
      return saveNewClaim(policyTypeId, answers, purchase, imageProps);
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => console.error(err));
});
