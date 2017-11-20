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
Parse.serverURL = "http://localhost:1337/parse";
