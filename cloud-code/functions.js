var Client = require("ssh2-sftp-client");
var Parse = require("parse/node");

const sftpOptions = {
  host: "103.13.129.149",
  port: "22",
  username: "sftpuser05",
  password: "xBFtSp9J:\\Pqs{=m"
};

function transferFileToHLAS() {
  var sftpClient = new Client();
  const nameMap = {
    pa: "pa",
    pa_mr: "pa",
    pa_wi: "pa",
    travel: "travel",
    mobile: "mobile"
  };
  const excelData = {
    pa: [["Policy ID"]],
    travel: [],
    mobile: []
  };
  return sftpClient
    .connect(sftpOptions)
    .then(() => {
      var Claim = Parse.Object.extend("Claim");
      query = new Parse.Query(Claim);
      query.ascending("createdAt");
      query.notEqualTo("claimSent", true);
      return query.find();
    })
    .then(claims => {
      claims.forEach(claim => {
        const policyTypeId = nameMap[claim.get("policyTypeId")];
      });
    });
}

module.exports = {
  transferFileToHLAS: transferFileToHLAS
};
