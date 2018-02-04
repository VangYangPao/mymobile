// @flow
import type { QuestionSetType, BuyClaimQuestionSetType } from "../../types";
// const

const travelClaimQuestions: QuestionSetType = [
  {
    question:
      "I will walk you through step by step. I'll do my best to get your claim paid fast. Firstly, please share with me the coverage that you would like to make a claim",
    responseType: ["string", "choice"],
    choices: [
      { label: "Death of Kin", value: "death" },
      {
        label: "Permanent Disablement",
        value: "permanentDisability"
      },
      {
        label: "Medical and Hospitalisation",
        value: "medicalReimbursement"
      },
      { label: "Travel Inconvenience", value: "travelInconveniece" },
      { label: "Others", value: "others" }
    ],
    id: "accidentType"
  },

  // ACCIDENT_DATE
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
      "Oh… I am sad to hear that. I’ll do my best to get your claim paid fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["permanentDisability"]
  },
  {
    question:
      "<%= firstName %> <%= lastName %>, I wish you a complete recovery. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["medicalReimbursement"]
  },
  {
    question:
      "<%= firstName %> <%= lastName %>, please share with me the date and time of loss or damage",
    responseType: "datetime",
    pastOnly: true,
    id: "accidentDate",
    include: ["travelInconveniece"]
  },

  // ACCIDENT_LOCATION
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation",
    include: [
      "medicalReimbursement",
      "permanentDisability",
      "travelInconveniece"
    ]
  },

  // ACCIDENT_CAUSE
  {
    question: "Share with me the cause of the accident?",
    responseType: "string",
    responseLength: 600,
    id: "accidentCause",
    include: ["death"]
  },
  {
    question: "Share with me how did you sustain your injury?",
    responseType: "string",
    responseLength: 600,
    id: "accidentCause",
    include: ["permanentDisability"]
  },
  {
    question: "Share with me the cause of the accident, injury, or illness?",
    responseType: "string",
    responseLength: 600,
    id: "accidentCause",
    include: ["medicalReimbursement"]
  },

  // ACCIDENT_DETAILS
  {
    question: "Oh, I am concerned… May I know the extent of your injury?",
    responseType: "string",
    responseLength: 600,
    id: "details",
    include: ["permanentDisability"]
  },
  {
    question:
      "Oh, I am concerned… May I know the extent of your injury/illness?",
    responseType: "string",
    responseLength: 600,
    id: "details",
    include: ["medicalReimbursement"]
  },
  {
    question:
      "Oh, I am so sorry to hear this! Please share with me the full details of the situation leading to loss or damage?",
    responseType: "string",
    responseLength: 600,
    id: "details",
    include: ["travelInconveniece"]
  },
  {
    question:
      "<%= firstName %> <%= lastName %>, share with me what had happened?",
    responseType: "string",
    responseLength: 600,
    id: "details",
    include: ["others"]
  },

  // ACCIDENT_RECURRENCE & OTHER_INSURANCE_COMPANY
  {
    question: "Have you suffered the same injury before?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "recurrence",
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Please explain the injury in detail?",
    responseType: "string",
    id: "recurrenceDetail",
    include: ["permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.recurrence"
  },
  {
    question:
      "Does <%= firstName %> <%= lastName %> have other takaful/insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["death", "permanentDisability"]
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNo"],
    labels: ["Insurance company name", "Policy number"],
    include: ["death", "permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.hasOtherInsuranceCoverage"
  },

  // TABLES
  {
    question:
      "Thank you for bearing with us. I need your help to itemise what are lost or damaged",
    responseType: "table",
    columns: [
      { label: "Description", id: "description", type: "string" },
      { label: "Date of Purchase", id: "dateOfPurchase", type: "date" },
      { label: "Place of Purchase", id: "placeOfPurchase", type: "string" },
      { label: "Original Price", id: "originalPrice", type: "number" }
    ],
    id: "lostOrDamagedItems",
    include: ["travelInconveniece"]
  },

  // DOCUMENTS & IMAGES
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label:
          "Death certificate that is certified true copy by lawyer or any notary public (if death occurs overseas)",
        id: "deathCertificate"
      },
      {
        label:
          "Autopsy report, or, toxicological report, or, coroner’s findings",
        id: "autopsyReport"
      },
      {
        label: "Repatriation report (if death occurs overseas)",
        id: "repatriationReport"
      },
      {
        label: "Police report (if accidental event)",
        id: "policeReport"
      },
      {
        label:
          "Letter from Immigration and Checkpoint Authority (ICA) (if death occurs overseas)",
        id: "immigrationLetter"
      },
      {
        label: "Document proof of claimant’s relationship to the deceased ",
        id: "relationshipProof"
      }
    ],
    include: ["death"],
    id: "claimImages"
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Original medical bills/receipts",
        id: "medicalBill"
      },
      {
        label:
          "If original bills/receipts submitted to other takaful operator/ insurer or your employer, snap/upload the reimbursement letter, or discharge voucher from takaful operator/ insurer, or letter from employer indicating the amount paid to you",
        id: "reimbursementLetter"
      },
      {
        label: "Medical report (if you are admitted to hospital)",
        id: "medicalReport"
      },
      {
        label: "Police report (if accidental)",
        id: "policeReport"
      },
      {
        label: "Inpatient discharge summary (if you are admitted to hospital)",
        id: "dischargeSummary"
      },

      { label: "Medical leave certificate", id: "medicalLeaveCertificate" },
      { label: "Work permit (if any)", id: "workPermit" }
    ],
    include: ["permanentDisability"],
    id: "claimImages"
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Original medical bills/receipts",
        id: "medicalBill"
      },
      {
        label:
          "If original bills/receipts submitted to other takaful operator/ insurer or your employer, snap/upload the reimbursement letter, or discharge voucher from takaful operator/ insurer, or letter from employer indicating the amount paid to you",
        id: "reimbursementLetter"
      },
      {
        label: "Medical report (if you are admitted to hospital)",
        id: "medicalReport"
      },
      {
        label: "Police report (if accidental)",
        id: "policeReport"
      },
      {
        label: "Inpatient discharge summary (if you are admitted to hospital)",
        id: "dischargeSummary"
      },

      { label: "Boarding pass / Flight itinerary", id: "boardingPass" }
    ],
    include: ["medicalReimbursement"],
    id: "claimImages"
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label:
          "Original receipts for replacement of personal documents (if any)",
        id: "receipts"
      },
      {
        label:
          "Original receipts for additional travelling/accommodation expenses (if any)",
        id: "travelReceipt"
      },
      {
        label: "Boarding pass/ Flight itinerary",
        id: "boardingPass"
      },
      {
        label: "Original purchase receipts",
        id: "originalPurchaseReceipt"
      },
      {
        label:
          "Photos showing the damage for each and every item (for damage cases)",
        id: "photosOfDamaged"
      },
      { label: "Boarding pass/ Flight itinerary", id: "boardingPass" },
      {
        label:
          "Document stating the compensation from airlines and/or other sources (for loss or damage by carrier)",
        id: "compensationDocument"
      },
      {
        label: "Property irregularity report (for loss or damage by carrier)",
        id: "irregularityReport"
      },
      {
        label: "Police report lodged within 24 hours (for loss cases)",
        id: "policeReport"
      }
    ],
    include: ["travelInconveniece"],
    id: "claimImages"
  },
  {
    question:
      "<%= firstName %> <%= lastName %>, to complete your claim, I need your help to post all the ORIGINAL RECEIPTS to: Level 5, Tower B, PJ City Development, No.15A, Jalan 219, Seksyen 51A, 46100 Petaling Jaya, Selangor, Malaysia, within 48 hours ",
    include: [
      "permanentDisability",
      "medicalReimbursement",
      "travelInconveniece"
    ],
    responseType: null
  },
  {
    question:
      "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim.",
    responseType: null,
    exclude: ["others"]
  },
  {
    question:
      "We shall divert your claim information to HLM Takaful respective department. . Please keep this phone with you at all times, as I shall send you notifications/ email and messages on your claim.",
    responseType: null,
    include: ["others"]
  }
];

export default travelClaimQuestions;
