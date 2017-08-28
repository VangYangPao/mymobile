export const travelClaimQuestions = [
  {
    question: "Firstly, are you planning to claim for...",
    responseType: ["string", "choice"],
    choices: [
      { label: "Death", value: "death" },
      { label: "Permanent Disability", value: "permanentDisability" },
      {
        label: "Medical Reimbursement (Overseas)",
        value: "medicalReimbursement"
      },
      {
        label: "Baggage Damaged / Loss in Custody",
        value: "baggageDamaged"
      },
      { label: "Loss of Personal Document", value: "lossOfPersonalDocument" },
      { label: "Travel Delay / Flight Misconnection", value: "travelDelay" },
      {
        label: "Trip Curtailment / Cancellation or Loss of Deposit",
        value: "tripCurtailment"
      },
      { label: "Personal Liability", value: "personalLiability" }
    ],
    id: "claimType"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Death certificate that is certified true copy by your lawyer or any notary public",
        id: "deathCertificate"
      },
      {
        label: "Letter from Immigration and Checkpoint Authority, ICA",
        id: "immigrationLetter"
      },
      {
        label: "Repatriation report",
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
    id: "deathClaimImages"
  },
  {
    question: "I’m so sorry to hear that. I assume you are <%= fullName %>’s claimant/next of kin. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["death"]
  },
  {
    question: "Oh… I am sad to hear that. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, I wish you get well soon. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["medicalReimbursement"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for damaged or loss of baggage while in the custody of others. Please share with me the date and time of damage or loss",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["baggageDamaged"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for loss of personal document. Please share with me the date and time of loss",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["lossOfPersonalDocument"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for trip curtailment (shortening of trip) or cancellation or loss of travel deposit ",
    responseType: null,
    include: ["tripCurtailment"]
  },
  {
    question: "<%= fullName %>, you just selected personal liability ",
    responseType: null,
    include: ["personalLiability"]
  },
  {
    question: "<%= fullName %>, you just selected the option to claim for travel delay, baggage delay, or flight misconnection. Please share with me the flight details",
    responseType: ["string", "string"],
    labels: ["Airline company", "Flight number"],
    id: ["airlineCompany", "flightNo"],
    include: ["travelDelay"]
  },
  {
    question: "What is the cause of travel delay, baggage delay, or flight misconnection",
    responseType: "string",
    responseLength: 600,
    id: "travelDelayCause",
    include: ["travelDelay"]
  },
  {
    question: "What is the amount you intend to claim?",
    responseType: "number",
    id: "claimAmount",
    include: ["travelDelay"]
  },
  {
    question: "Have you claimed from the airline or other source?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasClaimedFromOtherSource",
    include: ["travelDelay"]
  },

  {
    question: "What is the amount you claimed?",
    responseType: "number",
    id: "claimAmountFromOtherSource",
    include: ["travelDelay"],
    condition: "this.state.answers.hasClaimedFromOtherSource"
  },
  {
    question: "What is the ORIGINAL departure date, time and departing airport?",
    responseType: ["datetime", "string"],
    labels: ["Original Departure Date", "Departure Airport"],
    id: ["originalFlightDepartureDate", "originalFlightDepartureAirport"],
    include: ["travelDelay"]
  },
  {
    question: "What is the ACTUAL departure date, time and departing airport?",
    responseType: ["datetime", "string"],
    labels: ["Actual Departure Date", "Departure Airport"],
    id: ["actualFlightDepartureDate", "actualFlightDepartureAirport"],
    include: ["travelDelay"]
  },
  {
    question: "What is the cause of trip curtailment or cancellation? ",
    responseType: "string",
    responseLength: 600,
    id: "causeOfTripCurtailment",
    include: ["tripCurtailment"]
  },
  {
    question: "Please share with me the date of trip curtailment or cancellation",
    responseType: "date",
    pastOnly: true,
    id: "tripCurtailmentDate",
    include: ["tripCurtailment"]
  },
  {
    question: "If the trip curtailment or cancellation was caused by your medical condition, or your family member’s medical condition, have you or your family member suffered from this condition before? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "sufferedFromConditionBefore",
    include: ["tripCurtailment"]
  },
  {
    question: "Please explain the medical condition in detail",
    responseType: "string",
    id: "medicalCondition",
    include: ["tripCurtailment"],
    condition: "this.state.answers.sufferedFromConditionBefore"
  },
  {
    question: "Please share with me the NAME, ADDRESS and CONTACT of the attending physician",
    responseType: ["string", "string", ["string", "phoneNumber"]],
    labels: ["Name", "Address", "Contact number"],
    id: ["physicianName", "physicianAddress", "physicianContact"],
    include: ["tripCurtailment"],
    condition: "this.state.answers.sufferedFromConditionBefore"
  },
  {
    question: "What happened in detail leading to personal liability? ",
    responseType: "string",
    responseLength: 600,
    id: "personalLiabilityDetail",
    include: ["personalLiability"]
  },
  {
    question: "Was the accident due to carelessness or negligence on your part? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "isDueToCarelessness",
    include: ["personalLiability"]
  },
  {
    question: "Have you admitted fault? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasAdmittedFault",
    include: ["personalLiability"]
  },
  // {
  //   question: "Please provide the name and contact of witness",
  //   responseType: "table",
  //   columns: [
  //     { label: "Name", id: "name", type: "string" },
  //     { label: "Contact", id: "contact", type: "string" }
  //   ],
  //   id: "witnesses",
  //   include: ["personalLiability"]
  // },
  {
    question: "Is there any injury sustained by any person or persons?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "injurySustainedByAnyPerson",
    include: ["personalLiability"]
  },
  {
    question: "Please share in detail the injury sustained by the person or persons",
    responseType: "string",
    id: "injuryDetail",
    include: ["personalLiability"],
    condition: "this.state.answers.injurySustainedByAnyPerson"
  },
  {
    question: "Is there any damage to property or belongings? ",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "hasDamageToProperty",
    include: ["personalLiability"]
  },
  {
    question: "Please share in detail the extent of damage",
    responseType: "string",
    id: "damageDetail",
    include: ["personalLiability"],
    condition: "this.state.answers.hasDamageToProperty"
  },
  {
    question: "Is your baggage delayed?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "isBaggageDelayed",
    include: ["travelDelay"]
  },
  {
    question: "What is your baggage's ORIGINAL departure date, time and departing airport? ",
    responseType: ["datetime", "string"],
    labels: ["Original Departure Date", "Departure Airport"],
    id: ["originalBaggageDepartureDate", "originalBaggageDepartureAirport"],
    include: ["travelDelay"],
    condition: "this.state.answers.isBaggageDelayed"
  },
  {
    question: "What is your baggage's ACTUAL departure date, time and departing airport? ",
    responseType: ["datetime", "string"],
    labels: ["Actual Departure Date", "Departure Airport"],
    id: ["actualBaggageDepartureDate", "actualBaggageDepartureAirport"],
    include: ["travelDelay"],
    condition: "this.state.answers.isBaggageDelayed"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Original receipt or invoice of deposit paid in advance by you ",
        id: "originalReceipt"
      },
      {
        label: "Written confirmation from airline, or hotel, or travel agency, or service provider indicating non-refundable amount due to unavoidable trip cancellation by you",
        id: "writtenConfirmation"
      },
      {
        label: "Terms and conditions from airline, or hotel, or travel agency, or service provider indicating non-refundable clause",
        id: "termsAndCondition"
      },
      {
        label: "Relationship proof of immediate family member if postponement of trip is due to serious injury/illness/death of immediate family member",
        id: "relationshipProof"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation (if any)",
        id: "travelReceipt"
      },
      {
        label: "Death certificate of immediate family member (if any)",
        id: "familyDeathCertificate"
      },
      {
        label: "Memo/letter from registered medical practitioner certifying your travel companion or immediate family member injury/illness is critical or life-threatening (if any)",
        id: "letterForTravelCompanion"
      },
      {
        label: "Memo/letter from registered medical practitioner certifying you are unfit to travel (if any)",
        id: "letterForSelf"
      }
    ],
    id: "tripCurtailmentImages",
    include: ["tripCurtailment"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Scheduled and revised flight itinerary, or boarding pass",
        id: "boardingPass"
      },
      {
        label: "Written document from airline company on the on the duration of travel (and/or baggage) delay and the cause of travel (and/or baggage) delay",
        id: "delayDocumentFromAirline"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation ",
        id: "travelReceipt"
      },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Written document from airline company on the on the cause of flight misconnection, and stating there is no onward transportation available to you within 6 consecutive hours of your arrival time (if any)",
        id: "flightMisconnectionDocument"
      },
      {
        label: "Property irregularity report, and acknowledgement receipt of baggage received (if any)",
        id: "irregularityReport"
      }
    ],
    id: "travelDelayImages",
    include: ["travelDelay"]
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation"
  },
  {
    question: "What happened in detail? What is the cause of the accident?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    exclude: ["baggageDamaged"]
  },
  {
    question: "What happened in detail (leading to damage or loss)?",
    responseType: "string",
    responseLength: 600,
    id: "description",
    include: ["baggageDamaged"]
  },
  {
    question: "If the damage or loss happened whilst baggage was in transit or in custody, have any steps been taken to claim against them?",
    responseType: ["boolean", "choice"],
    choices: [
      {
        label: "Yes",
        value: true
      },
      { label: "No", value: false }
    ],
    id: "stepsTakenToClaim",
    include: ["baggageDamaged", "lossOfPersonalDocument"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original receipt for replacement of personal document",
        id: "replacementReceipt"
      },
      {
        label: "Original receipt for additional travelling and/or hotel accommodation ",
        id: "travelReceipt"
      },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Police report lodged within 24 hours (if any)",
        id: "policeReport"
      }
    ],
    id: "lossOfPersonalDocumentImages",
    include: ["lossOfPersonalDocument"]
  },
  // {
  //   question: "We are almost done here. I need your help to itemise what are lost or damaged",
  //   responseType: "table",
  //   columns: [
  //     {
  //       label: "Description (make and model)",
  //       id: "description",
  //       type: "string"
  //     },
  //     { label: "Date of Purchase", id: "dateOfPurchase", type: "date" },
  //     { label: "Place of Purchase", id: "placeOfPurchase", type: "string" },
  //     { label: "Original Price", id: "originalPrice", type: "number" },
  //     { label: "Claim Amount", id: "claimAmount", type: "number" }
  //   ],
  //   id: "baggageItems",
  //   include: ["baggageDamaged"]
  // },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original purchase receipts or Warranty cards",
        id: "purchaseReceipts"
      },
      { label: "Photos showing the damage", id: "damagePhotos" },
      {
        label: "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Property irregularity report (if any)",
        id: "irregularityReport"
      },
      {
        label: "Police report lodged within 24 hours (if any)",
        id: "policeReport"
      }
    ],
    id: "baggageDamagedImages",
    include: ["baggageDamaged"]
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Tour itinerary",
        id: "tourItinerary"
      },
      { label: "Police report", id: "policeReport" },
      {
        label: "Document proof by third party for claiming bodily injury or property damage against you",
        id: "documentProof"
      }
    ],
    id: "personalLiabilityImages",
    include: ["personalLiability"]
  },
  {
    question: "What is the injury you suffered? What is the extent of your injury?",
    responseType: "string",
    responseLength: 500,
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Try to recall for a moment, have you suffered the same injury before? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasSufferedSameInjury",
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Please explain the injury in detail",
    responseType: "string",
    id: "injuryDetail",
    include: ["permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  {
    question: "When did the symptoms first appear?",
    responseType: "date",
    pastOnly: true,
    id: "symptomsAppearDate",
    include: ["permanentDisability", "medicalReimbursement"]
  },

  {
    question: "Does <%= fullName %> have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["death"]
  },
  {
    question: "Do you have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["permanentDisability", "medicalReimbursement"]
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNumber"],
    labels: ["Insurance company name", "Policy number"],
    condition: "this.state.answers.hasOtherInsuranceCoverage === true",
    include: ["death", "permanentDisability", "medicalReimbursement"]
  },
  {
    question: "Have you completed your treatment?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasCompletedTreatment",
    include: ["permanentDisability"]
  },
  {
    question: "When is the treatment is expected to be completed?",
    responseType: "date",
    pastOnly: true,
    id: "treatmentCompleteDate",
    include: ["permanentDisability"],
    condition: "!this.state.answers.hasCompletedTreatment"
  },
  {
    question: "Do you have any hospital or medical leave?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I do", value: true },
      { label: "No, I don't", value: false }
    ],
    id: "hasMedicalLeave",
    include: ["permanentDisability"]
  },
  {
    question: "Share with me the end date of the medical leave",
    responseType: "date",
    pastOnly: true,
    id: "medicalLeaveDate",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasMedicalLeave"
  },
  {
    question: "During your hospital or medical leave, have you returned to work to do full, or light duties? ",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasReturnedToWork",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasMedicalLeave"
  },
  {
    question: "Share with me when you returned to work…",
    responseType: "date",
    pastOnly: true,
    id: "returnWorkDate",
    include: ["permanentDisability"],
    condition: "this.state.answers.hasReturnedToWork"
  },

  {
    question: "We are almost done to get you claim fast. I need your help to snap, or upload some photos.",
    responseType: null,
    include: ["permanentDisability"]
  },
  {
    question: "Please snap a clear photo of the boarding pass or flight itinerary",
    responseType: "images",
    responseLength: 30,
    id: "boardingPass",
    include: ["permanentDisability"]
  },
  {
    question: "Please snap a clear photo of the original medical bills and/or receipts. However, if you submitted the original bills/receipts to other insurer or your employer, please snap the photocopy medical bills/receipts",
    responseType: "images",
    responseLength: 30,
    id: "medicalBill",
    include: ["permanentDisability"]
  },
  {
    question: "<%= fullName %>, to complete your claim, I need your help to post the ORIGINAL MEDICAL BILLS AND/OR RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours ",
    responseType: null,
    include: ["permanentDisability", "medicalReimbursement", "tripCurtailment"]
  },
  {
    question: "If you have submitted the original bills and/or receipts to other insurer or your employer, please snap a clear photo of reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you. Either one will do.",
    responseType: "images",
    responseLength: 10,
    id: "reimbursementLetter",
    include: ["permanentDisability"]
  },

  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original medical bills/receipts (if any)",
        id: "medicalBill"
      },
      { label: "Discharge summary", id: "dischargeSummary" },
      {
        label: "Photocopy medical bills/receipts if original is submitted to other insurer",
        id: "photocopyMedicalBill"
      },
      {
        label: "Medical report",
        id: "medicalReport"
      },
      {
        label: "Police report (if any)",
        id: "policeReport"
      }
    ],
    include: ["medicalReimbursement"],
    id: "medicalReimbursementImages"
  },
  {
    question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Death certificate that is certified true copy by your lawyer or any notary public",
        id: "deathCertificate"
      },
      {
        label: "Letter from Immigration and Checkpoint Authority, ICA",
        id: "immigrationLetter"
      },
      {
        label: "Repatriation report",
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
    id: "deathClaimImages"
  },
  {
    question: "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim. Please switch on the notification. ",
    responseType: null
  }
];
