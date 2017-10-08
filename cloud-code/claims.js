"use strict";

var exports = module.exports;
exports.connectToSFTP = connectToSFTP;
exports.backupExistingFiles = backupExistingFiles;
exports.appendClaimToExcelFile = appendClaimToExcelFile;
exports.transformClaimToExcelRow = transformClaimToExcelRow;

var Client = require("ssh2-sftp-client");
var Parse = require("parse/node");
var path = require("path");
var fs = require("fs");
var stream = require("stream");
var util = require("util");
var Excel = require("exceljs");
var xlsx = require("node-xlsx");
var toArray = require("stream-to-array");

var BACKUP_DIR = "/ftp-response/Backup";
var CLAIMS_DIR = "/ftp-response/Claims";
var TRAVEL_CLAIMS = "TravelProtect360-Claims.xlsx";

function connectToSFTP(sftp) {
  return sftp.connect({
    host: "103.13.129.149",
    port: "22",
    username: "sftpuser05",
    password: "xBFtSp9J:\\Pqs{=m"
  });
}

function backupExistingFiles(sftp) {
  function recursivelyBackup(backupToPath, directory) {
    return sftp.list(directory).then(function(files) {
      var promises = [];
      files.forEach(function(file) {
        var promise = void 0;
        if (file.type === "d") {
          var newBackupPath = path.join(backupToPath, file.name);
          console.log("retrieve dir", newBackupPath);
          var recursive = true;
          promise = sftp.mkdir(newBackupPath, recursive).then(function() {
            var newFilePath = path.join(directory, file.name);
            console.log("created new dir", newFilePath);
            return recursivelyBackup(newBackupPath, newFilePath);
          });
        } else {
          var filePath = path.join(directory, file.name);
          console.log("retrieve file", filePath);
          promise = sftp.get(filePath).then(function(readStream) {
            var newBackupPath = path.join(backupToPath, file.name);
            console.log("created new file", newBackupPath);
            return sftp.put(readStream, newBackupPath);
          });
        }
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  return recursivelyBackup(BACKUP_DIR, CLAIMS_DIR);
}

function appendClaimToExcelFile(sftp, claim) {
  var claimRow = transformClaimToExcelRow(claim);
  var fixturesDir = path.join(__dirname, "..", "__tests__", "fixtures");
  // const filePath = path.join(fixturesDir, TRAVEL_CLAIMS);
  // const tmpPath = path.join(fixturesDir, "test-" + TRAVEL_CLAIMS);
  var filePath = path.join(CLAIMS_DIR, TRAVEL_CLAIMS);
  // /ftp-response/Claims/TravelProtect360-Claims.xlsx
  // /ftp-response/Claims/TravelProtect360-Claims.xl
  let workbook = new Excel.Workbook();
  var Readable = stream.Readable;
  var rs = new Readable();
  rs._read = function() {};
  return sftp
    .get(filePath, false, null)
    .then(function(rs) {
      // return toArray(rs)
      //   .then(function(parts) {
      //     var buffers = parts.map(function(part) {
      //       return util.isBuffer(part) ? part : Buffer.from(part);
      //     });
      //     return Buffer.concat(buffers);
      //   })
      //   .then(function(buf) {
      //     var workSheetsFromBuffer = xlsx.parse(buf);
      //     console.log(workSheetsFromBuffer);
      //   });
      return workbook.xlsx.read(rs);
    })
    .then(function() {
      let worksheet = workbook.getWorksheet(1);
      worksheet.spliceRows(2, 0, claimRow);
      var ws = stream.Writable();
      ws._write = function(chunk, enc, next) {
        next();
      };
      // rs.pipe(ws);
      return workbook.xlsx.write(ws).then(function() {
        return ws;
      });
    })
    .then(function(ws) {
      // workbook.xlsx.read(rs);
      return toArray(ws).then(function(parts) {
        var buffers = parts.map(function(part) {
          return util.isBuffer(part) ? part : Buffer.from(part);
        });
        return Buffer.concat(buffers);
      });
    })
    .then(function(buf) {
      return sftp.put(buf, filePath);
    });
}

function transformClaimToExcelRow(claim) {
  var ClaimID = claim.id;
  var CreatedOnDate = claim.get("createdAt");
  var purchase = claim.get("purchase");
  var policyholder = purchase.get("user");
  var PolicyholderName =
    policyholder.get("lastName") + " " + policyholder.get("firstName");
  var PolicyNo = purchase.get("policyId");
  var PolicyholderIDType = purchase.get("policyholderIdType");
  var PolicyholderIDNo = purchase.get("policyholderIdNo");

  var isClaimByPolicyholder = claim.get("claimFromPolicyholder");
  var ClaimantName = void 0,
    ClaimantIDType = void 0,
    ClaimantIDNo = void 0,
    ClaimantPhone = void 0,
    ClaimantEmail = void 0,
    ClaimantAddress = void 0;

  if (isClaimByPolicyholder) {
    ClaimantName = PolicyholderName;
    ClaimantIDType = purchase.get("idNumberType");
    ClaimantIDNo = purchase.get("idNumber");
    ClaimantPhone = purchase.get("phoneNumber");
    ClaimantEmail = purchase.get("email");
    ClaimantAddress = purchase.get("address");
  } else {
    var claimantFirstName = claim.get("claimantFirstName");
    var claimantLastName = claim.get("claimantLastName");
    if (claimantFirstName && claimantLastName) {
      ClaimantName = claimantLastName + " " + claimantFirstName;
    }
    ClaimantIDType = claim.get("claimantIdType");
    ClaimantIDNo = claim.get("claimantIdNo");
    ClaimantPhone = claim.get("claimantPhone");
    ClaimantEmail = claim.get("claimantEmail");
    ClaimantAddress = claim.get("claimantAddress");
  }
  var AccidentPlace = claim.get("accidentLocation");
  var AccidentDate = claim.get("accidentDate");
  var AccidentType = claim.get("accidentType");
  var AccidentLongDesc = claim.get("details");
  var CurrencyType = claim.get("currencyType");
  var TotalAmount = claim.get("claimAmount");
  var SimilarCondition = claim.get("recurrenceDetail");

  var InsuranceCoInvolved = "";
  if (claim.get("hasOtherInsuranceCoverage")) {
    var otherInsuranceCo = claim.get("otherInsuranceCo");
    var otherPolicyNo = claim.get("otherPolicyNo");
    InsuranceCoInvolved =
      "Insurance compny: " + otherInsuranceCo + "\nPolicy No: " + otherPolicyNo;
  }
  var documents = claim.get("documents") || [];
  var DocumentList = documents
    .map(function(d) {
      return d.name + "." + d.ext;
    })
    .join("\n");

  var claimHeader = [
    "ClaimID",
    "CreatedOnDate",
    "PolicyholderName",
    "PolicyNo",
    "PolicyholderIDType",
    "PolicyholderIDNo",
    "ClaimantName",
    "ClaimantIDType",
    "ClaimantIDNo",
    "ClaimantPhone",
    "ClaimantEmail",
    "ClaimantAddress",
    "AccidentPlace",
    "AccidentDate",
    "AccidentType",
    "AccidentLongDesc",
    "CurrencyType",
    "TotalAmount",
    "Similar Condition & Recurrence",
    "Name Of Insurance Company(s) Involved",
    "Respect Of This Claim To",
    "DocumentList"
  ];
  var newClaimRow = [
    ClaimID,
    CreatedOnDate,
    PolicyholderName,
    PolicyNo,
    PolicyholderIDType,
    PolicyholderIDNo,
    ClaimantName,
    ClaimantIDType,
    ClaimantIDNo,
    ClaimantPhone,
    ClaimantEmail,
    ClaimantAddress,
    AccidentPlace,
    AccidentDate,
    AccidentType,
    AccidentLongDesc,
    CurrencyType,
    TotalAmount,
    SimilarCondition,
    InsuranceCoInvolved,
    ClaimantName,
    DocumentList
  ].map(function(r) {
    return r || "";
  });
  return newClaimRow;
}
