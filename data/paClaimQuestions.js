export default (paClaimQuestions = [
  // CLAIM TYPE
  {
    question: "I will walk you through step by step. I'll do my best to get your claim paid fast. Firstly, which are you planning to claim?",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" }
    ],
    include: ["pa"],
    id: "claimType"
  },
  {
    question: "Firstly, are you planning to claim for",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      { label: "Medical Reimbursement", value: "medicalReimbursement" }
    ],
    include: ["pa_mr"],
    id: "claimType"
  },
  {
    question: "Firstly, are you planning to claim for",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      { label: "Weekly Cash Compensation", value: "weeklyCompensation" }
    ],
    include: ["pa_wi"],
    id: "claimType"
  },

  {
    question: "I'm so sorry to hear that. I assume you are <%= fullName %>’s claimant/next of kin. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["death"]
  },
  {
    question: "Oh… I am sad to hear that. Let me help you out to get the claim paid fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for weekly compensation. To claim, you need to be medically unfit to work for a minimum of 7 days continuously.",
    responseType: null,
    include: ["weeklyCompensation"]
  },

  {
    question: "Get well soon! Let me help you out to get the claim paid fast. Please share with me the date and time of the accident",
    responseType: null,
    include: ["medicalReimbursement"]
  },
  {
    question: "Please share with me the date and time of the accident?",
    responseType: "datetime",
    pastOnly: true,
    include: ["medicalReimbursement", "weeklyCompensation"]
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation"
  },
  {
    question: "What happened in detail?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    include: ["death"]
  },
  {
    question: "Share with me how you sustained your injury?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Oh I am concerned… may I know the extent of your injury?",
    responseType: "string",
    id: "injuryExtent",
    exclude: ["death"]
  },
  {
    question: "Have you suffered the same injury before?",
    responseType: ["boolean", "choice"],
    label: "SUFFERED SAME INJURY",
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasSufferedSameInjury",
    exclude: ["death"]
  },
  {
    question: "Please explain the injury in detail?",
    responseType: "string",
    id: "injuryDetail",
    exclude: ["death"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  // {
  //   question: "When did the symptoms first appear? ",
  //   responseType: "date",
  //   id: "symptomsAppearDate",
  //   include: ["medicalReimbursement", "weeklyCompensation"],
  //   condition: "this.state.answers.hasSufferedSameInjury"
  // },
  {
    question: "Try to recall, do you have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    label: "OTHER INSURANCE COVERAGE",
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    exclude: ["death"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  {
    question: "Does <%= fullName %> have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    label: "OTHER INSURANCE COVERAGE",
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    include: ["death"]
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNumber"],
    labels: ["Insurance company name", "Policy number"],
    include: ["death"],
    condition: "this.state.answers.hasOtherInsuranceCoverage===true"
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNumber"],
    labels: ["Insurance company name", "Policy number"],
    exclude: ["death"],
    condition: "this.state.answers.hasSufferedSameInjury && this.state.answers.hasOtherInsuranceCoverage"
  },
  {
    question: "Have you completed your treatment?",
    responseType: ["boolean", "choice"],
    id: "hasCompletedTreatment",
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    include: ["medicalReimbursement", "weeklyCompensation"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  {
    question: "When is the treatment expected to be completed?",
    responseType: ["date"],
    futureOnly: true,
    id: "treatmentCompleteDate",
    condition: "this.state.answers.hasSufferedSameInjury && !this.state.answers.hasCompletedTreatment",
    include: ["medicalReimbursement"]
  },
  // {
  //   question: "Do you have any hospital or medical leave? ",
  //   responseType: ["boolean", "choice"],
  //   id: "hasMedicalLeave",
  //   choices: [
  //     {
  //       label: "Yes",
  //       value: true
  //     },
  //     { label: "No", value: false }
  //   ],
  //   condition: "!this.state.answers.hasOtherInsuranceCoverage",
  //   include: ["permanentDisability"]
  // },
  // {
  //   question: "Share with me the medical leave date",
  //   responseType: ["date"],
  //   pastOnly: true,
  //   id: "medicalLeaveDate",
  //   condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave",
  //   include: ["permanentDisability"]
  // },
  // {
  //   question: "During your hospital or medical leave, have you returned to work to do full, or light duties? ",
  //   responseType: ["boolean", "choice"],
  //   id: "hasReturnedToWork",
  //   choices: [
  //     {
  //       label: "Yes",
  //       value: true
  //     },
  //     { label: "No", value: false }
  //   ],
  //   condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave",
  //   include: ["permanentDisability"]
  // },
  // {
  //   question: "Share with me when you returned to work",
  //   responseType: ["date"],
  //   pastOnly: true,
  //   id: "returnWorkDate",
  //   condition: "!this.state.answers.hasOtherInsuranceCoverage && this.state.answers.hasMedicalLeave && this.state.answers.hasReturnedToWork",
  //   include: ["permanentDisability"]
  // },
  // {
  //   question: "Here is the final question, has <%= fullName %> %>'s' employer purchased any insurance coverage for this accident? ",
  //   responseType: ["string", "string"],
  //   responseType: ["boolean", "choice"],
  //   id: "hasEmployerInsuranceCoverage",
  //   label: "OTHER INSURANCE COVERAGE",
  //   choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
  //   include: ["death"]
  // },
  // {
  //   question: "What is the insurance company and policy number?",
  //   responseType: ["string", "string"],
  //   id: ["employerInsuranceCo", "employerPolicyNo"],
  //   labels: ["Insurance company name", "Policy number"],
  //   condition: "this.state.answers.hasEmployerInsuranceCoverage === true",
  //   include: ["death"]
  // },

  // 2nd half
  {
    question: "May I know if FULLNAME passed away in Singapore or outside of Singapore?",
    responseType: ["string", "choice"],
    id: "deathInSingapore",
    choices: [
      { label: "In Singapore", value: true },
      { label: "Outside of Singapore", value: false }
    ],
    include: ["death"]
  },

  {
    question: "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Original medical bills/receipts", id: "originalMedicalBill" },
      {
        label: "If original bills/receipts submitted to other insurer or your employer, snap/upload the reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you",
        id: "reimbursementLetter"
      },
      {
        label: "Medical report",
        id: "medicalReport"
      },
      {
        label: "Police report",
        id: "policeReport"
      },
      {
        label: "Inpatient discharge summary",
        id: "dischargeSummary"
      },
      {
        label: "Medical leave certificate",
        id: "medicalLeaveCertificate"
      },
      {
        label: "Work permit (if any)",
        id: "workPermit"
      }
    ],
    include: [
      "permanentDisability",
      "medicalReimbursement",
      "weeklyCompensation"
    ],
    id: "claimImages"
  },

  {
    question: "<%= fullName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
    responseType: null,
    exclude: ["death"]
  },

  // {
  //   question: "Please snap a clear photo of the original medical bills and/or receipts",
  //   responseType: "images",
  //   responseLength: 30,
  //   id: "originalMedicalBill",
  //   exclude: ["death"]
  // },

  // {
  //   question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of the photocopy medical bills and/or receipts",
  //   responseType: "images",
  //   responseLength: 30,
  //   id: "otherMedicalBill",
  //   exclude: ["death"]
  // },
  // {
  //   question: "If you have submitted the original bills and receipts to other insurer or your employer, please snap a clear photo of reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you. Either one will do.",
  //   responseType: "images",
  //   responseLength: 10,
  //   id: "reimbursementLetter",
  //   exclude: ["death"]
  // },
  // {
  //   question: "If you had hospital admission, please snap a clear photo of the In-patient Discharge Summary",
  //   responseType: "images",
  //   responseLength: 10,
  //   id: "dischargeSummary",
  //   include: ["medicalReimbursement"],
  //   condition: "this.state.answers.reimbursementMoreThan5000"
  // },
  // {
  //   question: "If you had hospital admission, please snap a clear photo of the Medical Report (indicating your diagnosis)",
  //   responseType: "images",
  //   responseLength: 10,
  //   id: "medicalReport",
  //   include: ["medicalReimbursement"],
  //   condition: "this.state.answers.reimbursementMoreThan5000"
  // },
  // {
  //   question: "If you had hospital admission, please download the ATTENDING PHYSICIAN STATEMENT. Print out, let your doctor fill up, and finally snap a clear photo of the APS",
  //   responseType: "images",
  //   responseLength: 10,
  //   id: "physicianStatement",
  //   include: ["medicalReimbursement"],
  //   condition: "this.state.answers.reimbursementMoreThan5000"
  // },

  {
    question: "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Death certificate", id: "deathCertificate" },
      {
        label: "Autopsy report, or, toxicological report, or, coroner’s findings",
        id: "autopsyReport"
      },
      {
        label: "Last Will of deceased, or, Letter of Administration",
        id: "lastWill"
      },
      {
        label: "Estate Duty of Certificate",
        id: "estateDuty"
      },
      {
        label: "Document proof of claimant’s relationship to the person who died",
        id: "relationshipProof"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["death"],
    id: "insideSGClaimImages",
    condition: "this.state.answers.deathInSingapore"
  },

  {
    question: "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Death certificate that is certified true copy by your lawyer or any notary public",
        id: "deathCertificate"
      },
      {
        label: "Letter from Immigration and Checkpoint Authority, ICA",
        id: "immigrationLetter"
      },
      {
        label: "Repatriation report (if any)",
        id: "repatriationReport"
      },
      {
        label: "Document proof of claimant’s relationship to the person who died",
        id: "relationshipProof"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["death"],
    id: "outsideSGClaimImages",
    condition: "!this.state.answers.deathInSingapore"
  },

  // WEEKLY COMPENSATION
  {
    question: "Please snap a clear photo of the medical certificate issued by a registered physician in Singapore",
    responseType: "images",
    responseLength: 10,
    id: "medicalCertificate",
    include: ["weeklyCompensation"]
  },

  // CONFIRM
  {
    question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim.",
    responseType: "boolean",
    id: "confirm"
  }
]);
