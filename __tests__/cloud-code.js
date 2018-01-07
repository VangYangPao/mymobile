// @flow
import Parse from "parse/node";
Parse.initialize("microumbrella");
Parse.masterKey = "lF8birzBOfWSvs908";
// Parse.serverURL = "https://api-dev.microumbrella.com/parse";
Parse.serverURL =
  process.env.NODE_ENV === "dev"
    ? "https://api-dev.microumbrella.com/parse"
    : "http://localhost:1337/parse";

import { transferFileToHLAS } from "../cloud-code/functions";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it("transfers files to HLAS SFTP server", () => {
  return transferFileToHLAS().then(res => console.log(res));
});
