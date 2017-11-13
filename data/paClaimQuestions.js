export default (paClaimQuestions = [
  // CLAIM TYPE
  {
    question:
      "I will walk you through step by step. I'll do my best to get your claim paid fast. Firstly, which coverage are you planning to claim?",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" }
    ],
    include: ["pa"],
    id: "accidentType"
  },
  {
    question:
      "I wish you a complete recovery.  Let me quickly guide you through the claims process.  Please share with me the date and time of the accident",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      {
        label: "Medical Reimbursement / Weekly Indemnity",
        value: "medicalReimbursement"
      }
    ],
    include: ["pa_mr"],
    id: "accidentType"
  },
  {
    question:
      "I wish you a complete recovery.  Let me quickly guide you through the claims process.  Please share with me the date and time of the accident",
    responseType: ["string", "choice"],
    label: "CHOOSE CLAIM TYPE",
    choices: [
      { label: "Death of Kin", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      {
        label: "Medical Reimbursement / Weekly Indemnity",
        value: "medicalReimbursement"
      }
    ],
    include: ["pa_wi"],
    id: "accidentType"
  },

  // Intros
  {
    question:
      "You must be <%= firstName %> <%= lastName %>’s claimant/next of kin. I am so sorry for your loss. My deepest condolences to you and your family! Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["death"]
  },
  {
    question:
      "Oh… I am sad to hear that. Let me help you out to get your claim paid fast. Please share with me the date and time of the accident",

    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["permanentDisability"]
  },
  {
    question:
      "Get well soon! Let me help you out to get the claim paid fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["medicalReimbursement"]
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
    id: "details",
    include: ["death"]
  },
  {
    question: "Share with me how you sustained your injury?",
    responseType: "string",
    responseLength: 600,
    id: "details",
    include: [
      "permanentDisability",
      "medicalReimbursement",
      "weeklyCompensation"
    ]
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
    id: "recurrence",
    exclude: ["death"]
  },
  {
    question: "Please explain the injury in detail?",
    responseType: "string",
    id: "recurrenceDetail",
    exclude: ["death"],
    condition: "this.state.answers.recurrence"
  },
  // FIX: THIS QUESTION CRASHES APP WHEN UNCOMMENTED
  {
    question: "When did the symptoms first appear? ",
    responseType: "date",
    id: "symptomsAppearDate",
    include: ["medicalReimbursement", "weeklyCompensation"],
    condition: "this.state.answers.recurrence"
  },
  {
    question:
      "Try to recall, do you have other insurance coverage for this accident?",
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
    condition: "this.state.answers.recurrence"
  },
  {
    question:
      "Does <%= firstName %> <%= lastName %> have other insurance coverage for this accident?",
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
    id: ["otherInsuranceCo", "otherPolicyNo"],
    labels: ["Insurance company name", "Policy number"],
    include: ["death"],
    condition: "this.state.answers.hasOtherInsuranceCoverage===true"
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNo"],
    labels: ["Insurance company name", "Policy number"],
    exclude: ["death"],
    condition:
      "this.state.answers.recurrence && this.state.answers.hasOtherInsuranceCoverage"
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
    condition: "this.state.answers.recurrence"
  },
  {
    question: "When is the treatment expected to be completed?",
    responseType: ["date"],
    futureOnly: true,
    id: "treatmentCompleteDate",
    condition:
      "this.state.answers.recurrence && !this.state.answers.hasCompletedTreatment",
    include: ["medicalReimbursement", "weeklyCompensation"]
  },

  // 2nd half
  {
    question:
      "May I know if <%= firstName %> <%= lastName %> passed away in Singapore or outside of Singapore?",
    responseType: ["string", "choice"],
    id: "deathInSingapore",
    choices: [
      { label: "In Singapore", value: true },
      { label: "Outside of Singapore", value: false }
    ],
    include: ["death"]
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Death certificate", id: "deathCertificate" },
      {
        label:
          "Autopsy report, or, toxicological report, or, coroner’s findings",
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
        label:
          "Document proof of claimant’s relationship to the person who died",
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
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label:
          "Death certificate that is certified true copy by your lawyer or any notary public",
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
        label:
          "Document proof of claimant’s relationship to the person who died",
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

  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Original medical bills/receipts", id: "originalMedicalBill" },
      {
        label:
          "If original bills/receipts submitted to other insurer or your employer, snap/upload the reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you",
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
    question:
      "<%= firstName %> <%= lastName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
    responseType: null,
    exclude: ["death"]
  },

  // CONFIRM
  {
    question:
      "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim.",
    responseType: null,
    id: "confirm"
  }
]);
