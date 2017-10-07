// @flow
import Client from "ssh2-sftp-client";
import Parse from "parse/react-native";

export function connectSFTP() {
  let sftp = new Client();
  return sftp
    .connect({
      host: "103.13.129.149",
      port: "22",
      username: "sftpuser05",
      password: "xBFtSp9J:\\Pqs{=m"
    })
    .then(() => {
      return sftp.list("/ftp-request");
    })
    .then(data => {
      console.log(data, "the data info");
    });
}

export function transformClaimToExcelRow(claim) {
  const ClaimID = claim.id;
  const CreatedOnDate = claim.get("createdAt");
  const purchase = claim.get("purchase");
  const policyholder = purchase.get("user");
  const PolicyholderName =
    policyholder.get("lastName") + " " + policyholder.get("firstName");
  const PolicyNo = purchase.get("policyId");
  const PolicyholderIDType = purchase.get("policyholderIdType");
  const PolicyholderIDNo = purchase.get("policyholderIdNo");

  const isClaimByPolicyholder = claim.get("claimFromPolicyholder");
  let ClaimantName,
    ClaimantIDType,
    ClaimantIDNo,
    ClaimantPhone,
    ClaimantEmail,
    ClaimantAddress;

  if (isClaimByPolicyholder) {
    ClaimantName = PolicyholderName;
    ClaimantIDType = purchase.get("idNumberType");
    ClaimantIDNo = purchase.get("idNumber");
    ClaimantPhone = purchase.get("phoneNumber");
    ClaimantEmail = purchase.get("email");
    ClaimantAddress = purchase.get("address");
  } else {
    let ClaimantName = "";
    const claimantFirstName = claim.get("claimantFirstName");
    const claimantLastName = claim.get("claimantLastName");
    if (claimantFirstName && claimantLastName) {
      ClaimantName = claimantLastName + " " + claimantFirstName;
    }
    ClaimantIDType = claim.get("claimantIdType");
    ClaimantIDNo = claim.get("claimantIdNo");
    ClaimantPhone = claim.get("claimantPhone");
    ClaimantEmail = claim.get("claimantEmail");
    ClaimantAddress = claim.get("claimantAddress");
  }
  const AccidentPlace = claim.get("accidentLocation");
  const AccidentDate = claim.get("accidentDate");
  const AccidentType = claim.get("accidentType");
  const AccidentLongDesc = claim.get("accidentDescription");
  const CurrencyType = claim.get("currencyType");
  const TotalAmount = claim.get("claimAmount");
  const SimilarCondition = claim.get("recurrenceDetail");

  let InsuranceCoInvolved = "";
  if (claim.get("hasOtherInsuranceCoverage")) {
    const otherInsuranceCo = claim.get("otherInsuranceCo");
    const otherPolicyNo = claim.get("otherPolicyNo");
    InsuranceCoInvolved = `Insurance compny: ${otherInsuranceCo}\nPolicy No: ${otherPolicyNo}`;
  }
  const documents = claim.get("documents") || [];
  const DocumentList = documents.map(d => `${d.name}.${d.ext}`).join("\n");

  const claimHeader = [
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
  const newClaimRow = [
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
  ].map(r => r || "");
  return [claimHeader, newClaimRow];
}
