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
var request = require("request");

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
          // console.log("retrieve dir", newBackupPath);
          var recursive = true;
          promise = sftp.mkdir(newBackupPath, recursive).then(function() {
            var newFilePath = path.join(directory, file.name);
            // console.log("created new dir", newFilePath);
            return recursivelyBackup(newBackupPath, newFilePath);
          });
        } else {
          var filePath = path.join(directory, file.name);
          console.log("retrieve file", filePath);
          promise = sftp.get(filePath, true, null).then(function(readStream) {
            var newBackupPath = path.join(backupToPath, file.name);
            console.log("created new file", newBackupPath);
            return sftp.put(readStream, newBackupPath, true, null);
          });
        }
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  return recursivelyBackup(BACKUP_DIR, CLAIMS_DIR);
}

function appendClaimToExcelFile(sftp, claims) {
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
  var filePath = path.join(CLAIMS_DIR, TRAVEL_CLAIMS);
  let workbook = new Excel.Workbook();
  return sftp
    .get(filePath, false, null)
    .then(function(rs) {
      return workbook.xlsx.read(rs);
    })
    .then(function() {
      let worksheet = workbook.getWorksheet(1);
      var claimsRows = claims.map(transformClaimToExcelRow);
      worksheet.spliceRows.apply(worksheet, [2, 0].concat(claimsRows));
      // var row = worksheet.getRow(2);
      // row.eachCell(function(cell, colNumber) {
      //   if (cell.value instanceof Date) {
      //     cell.alignment = { vertical: "bottom", horizontal: "right" };
      //   } else {
      //     cell.alignment = { vertical: "bottom", horizontal: "left" };
      //   }
      // });
      // row.getCell("V").alignment = { wrapText: true };
      // row.commit();
      var ws = new stream.Transform();
      ws._transform = function(chunk, encoding, done) {
        this.push(chunk);
        done();
      };
      return workbook.xlsx.write(ws).then(function() {
        return ws;
      });
    })
    .then(function(ws) {
      // append to Excel file
      return sftp.put(ws, filePath, false, null);
    })
    .then(function() {
      // create document directory
      var recursive = true; // for safe guard
      var promises = claims.map(function(claim) {
        var documentDir = path.join(CLAIMS_DIR, "Documents", claim.id);
        var documents = claim.get("documents");
        return sftp.mkdir(documentDir, recursive);
      });
      return Promise.all(promises);
    })
    .then(function() {
      var claimPromises = claims.map(function(claim) {
        var documents = claim.get("documents");
        var documentDir = path.join(CLAIMS_DIR, "Documents", claim.id);
        var documentPromises = documents.map(function(doc) {
          var filename = doc.name + "." + doc.ext;
          var filePath = path.join(documentDir, filename);
          var ws = new stream.Transform();
          ws._transform = function(chunk, encoding, done) {
            this.push(chunk);
            done();
          };
          var url = doc.file.url();
          request(url).pipe(ws);
          return sftp.put(ws, filePath);
        });
        return Promise.all(documentPromises);
      });
      return Promise.all(claimPromises);
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
