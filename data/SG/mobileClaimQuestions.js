export default (mobileClaimQuestions = [
  {
    question:
      "Oops… Don’t worry. I will walk you through step by step. I'll do my best to get your claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate"
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation"
  },
  {
    question: "How did the damage occur? Please specify in detail",
    responseType: "string",
    responseLength: 600,
    id: "details"
  },
  {
    question: "Please fill in the details below for us to payout claims to you",
    responseType: ["string", "string", "string", "string", "string", "string"],
    id: [
      "accountHolderName",
      "bankName",
      "bankAccountNo",
      "bankCode",
      "branchCode",
      "swiftCode"
    ],
    labels: [
      "Full name",
      "Bank name",
      "Account no.",
      "Bank code",
      "Branch code",
      "Swift code"
    ]
  },
  {
    question:
      "We are almost done to get your claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "NRIC", id: "nric" },
      {
        label: "Mobile phone IMEI number",
        id: "IMEINumber"
      },
      {
        label: "Receipt indicating your phone’s IMEI number",
        id: "receiptIMEINumber"
      },
      {
        label: "Evidences of damage",
        id: "evidenceOfDamage"
      },
      {
        label: "Make, model and colour of your mobile phone",
        id: "phoneMakeModelColour"
      },
      {
        label: "Damaged phone",
        id: "damagedPhone"
      }
    ],
    id: "mobileImages"
  },
  {
    question:
      "In the past 3 years, have you made any claim on mobile phone under any type of insurance policy? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasMadeClaim"
  },
  {
    question:
      "Thank you for the claim. We and/or the workshop personnel will follow up with a call very soon.",
    responseType: null
  }
]);
