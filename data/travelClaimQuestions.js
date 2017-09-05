export default (travelClaimQuestions = [
  {
    question:
      "I will walk you through step by step. I'll do my best to get your claim paid fast. Firstly, please share with me the coverage that you would like to make a claim",
    responseType: ["string", "choice"],
    choices: [
      { label: "Death", value: "death" },
      {
        label: "Personal Accident / Medical Reimbursement",
        value: "medicalReimbursement"
      },
      {
        label:
          "Loss or Damage of Baggage, Personal Belongings, Personal Documents or Money",
        value: "lossOfPersonalDocument"
      },
      { label: "Delay or Flight Misconnection", value: "travelDelay" },
      {
        label: "Trip Curtailment / Cancellation or Loss of Deposit",
        value: "tripCurtailment"
      },
      { label: "Personal Liability", value: "personalLiability" },
      { label: "Others", value: "others" }
    ],
    id: "claimType"
  },
  {
    question:
      "You must be FULLNAME’s claimant/next of kin. I am so sorry for your loss. My deepest condolences to you and your family! Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["death"]
  },
  {
    question: "Share with me the cause of the accident?",
    responseType: "string",
    id: "accidentCause",
    include: ["death"]
  },
  // causes crash
  {
    question:
      "FULLNAME, I wish you a complete recovery. I’ll do my best to get your claim paid fast. Please share with me the date and time of the accident",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["medicalReimbursement"]
  },
  {
    question:
      "Please share with me the cause of the accident, injury, or illness?  ",
    responseType: "string",
    responseLength: 600,
    id: "accidentCause",
    include: ["medicalReimbursement"]
  },
  {
    question:
      "<%= fullName %>, I wish you get well soon. Let me help out on the claim fast. Please share with me the date and time of the accident",
    responseType: null,
    include: ["medicalReimbursement"]
  },
  // causes crash
  {
    question:
      "FULLNAME, you just selected the option to claim for loss or damaged items",
    responseType: "datetime",
    pastOnly: true,
    id: "claimDate",
    include: ["lossOfPersonalDocument"]
  },
  {
    question: "Please share with me the flight details",
    responseType: ["string", "string"],
    labels: ["Airline company", "Flight number"],
    id: ["airlineCompany", "flightNo"],
    include: ["travelDelay"]
  },
  {
    question:
      "Oh, I am so sorry to hear about the inconvenience! Will you share with me the cause of this travel delay, baggage delay, or flight misconnection? ",
    responseType: "string",
    id: "travelDelayCause",
    include: ["travelDelay"]
  },

  {
    question:
      "FULLNAME, you just selected the option to claim for trip curtailment (shortening of trip) or trip cancellation or loss of travel deposit",
    responseType: null,
    include: ["tripCurtailment"]
  },
  {
    question: "<%= fullName %>, you just selected personal liability ",
    responseType: null,
    include: ["personalLiability"]
  },
  {
    question: "FULLNAME, share with me what had happened? ",
    responseType: "string",
    id: "details",
    include: ["others"]
  },

  {
    question:
      "What is the amount you claimed from the airline or other source? ",
    responseType: "number",
    id: "claimAmountFromOtherSource",
    include: ["travelDelay"]
  },
  {
    question:
      "What is the ORIGINAL departure date, time and departing airport?",
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
    question:
      "I am so sorry to hear about this.  Please share with me the cause of your trip curtailment or cancellation? ",
    responseType: "string",
    responseLength: 600,
    id: "causeOfTripCurtailment",
    include: ["tripCurtailment"]
  },
  {
    question:
      "Please share with me the date of trip curtailment or cancellation",
    responseType: "date",
    pastOnly: true,
    id: "tripCurtailmentDate",
    include: ["tripCurtailment"]
  },
  {
    question:
      "If the trip curtailment or cancellation was caused by your medical condition, or your family member’s medical condition, have you or your family member suffered from this condition before? ",
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
    question:
      "Please share with me the NAME, ADDRESS and CONTACT of the attending physician",
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
    question:
      "What is your baggage's ORIGINAL arrival date, time and arriving airport? ",
    responseType: ["datetime", "string"],
    labels: ["Original Departure Date", "Departure Airport"],
    id: ["originalBaggageArrivalDate", "originalBaggageArrivalAirport"],
    include: ["travelDelay"]
  },
  {
    question:
      "What is your baggage's ACTUAL arrival date, time and arriving airport? ",
    responseType: ["datetime", "string"],
    labels: ["Actual Departure Date", "Departure Airport"],
    id: ["actualBaggageArrivalDate", "actualBaggageArrivalAirport"],
    include: ["travelDelay"]
  },
  {
    question: "Where did it happen?",
    responseType: "string",
    id: "accidentLocation",
    include: ["death", "medicalReimbursement", "lossOfPersonalDocument"]
  },
  {
    question:
      "Oh, I am so sorry to hear this!  Please share with me the full details of the situation leading to loss or damage?",
    responseType: "string",
    responseLength: 600,
    id: "lossDetails",
    include: ["lossOfPersonalDocument"]
  },
  // {
  //   question: "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
  //   responseType: "imageTable",
  //   columns: [
  //     { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
  //     {
  //       label: "Tour itinerary",
  //       id: "tourItinerary"
  //     },
  //     { label: "Police report", id: "policeReport" },
  //     {
  //       label: "Document proof by third party for claiming bodily injury or property damage against you",
  //       id: "documentProof"
  //     }
  //   ],
  //   id: "personalLiabilityImages",
  //   include: ["personalLiability"]
  // },

  {
    question:
      "Oh, I am concerned! May I know the extent of your injury/illness?  ",
    responseType: "string",
    responseLength: 600,
    include: ["medicalReimbursement"]
  },
  {
    question: "Have you suffered the same injury/illness before?",
    responseType: ["boolean", "choice"],
    choices: [
      { label: "Yes, I have", value: true },
      { label: "No, I have not", value: false }
    ],
    id: "hasSufferedSameInjury",
    include: ["medicalReimbursement"]
  },
  {
    question: "Please explain the injury in detail",
    responseType: "string",
    id: "injuryDetail",
    include: ["medicalReimbursement"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  // FIX: THIS QUESTION CRASHES APP WHEN UNCOMMENTED
  {
    question: "When did the symptoms first appear?",
    responseType: "date",
    pastOnly: true,
    id: "symptomsAppearDate",
    include: ["medicalReimbursement"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },

  {
    question:
      "Does <%= fullName %> have other insurance coverage for this accident?",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["death"]
  },
  {
    question:
      "Try to recall, do you have other insurance coverage for this accident? ",
    responseType: ["boolean", "choice"],
    id: "hasOtherInsuranceCoverage",
    choices: [{ label: "Yes", value: true }, { label: "No", value: false }],
    include: ["permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.hasSufferedSameInjury"
  },
  {
    question: "What is the insurance company and policy number?",
    responseType: ["string", "string"],
    id: ["otherInsuranceCo", "otherPolicyNumber"],
    labels: ["Insurance company name", "Policy number"],
    include: ["death", "permanentDisability", "medicalReimbursement"],
    condition: "this.state.answers.hasOtherInsuranceCoverage"
  },
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
        label: "Original medical bills/receipts (if any)",
        id: "medicalBill"
      },
      {
        label:
          "If original bills/receipts submitted to other insurer or your employer, snap/upload the reimbursement letter, or discharge voucher from insurer, or letter from employer indicating the amount paid to you",
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

      { label: "Boarding pass/Flight itinerary", id: "boardingPass" }
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
        id: "originalReceiptForReplacement"
      },
      {
        label:
          "Original receipts for additional travelling/accommodation expenses (if any)",
        id: "originalReceiptForAccomodation"
      },
      { label: "Boarding pass/ Flight itinerary ", id: "boardingPass" },
      { label: "Original purchase receipts", id: "originalPurchaseReceipt" },
      {
        label:
          "Photos showing the damage for each and every item (for damage cases)",
        id: "photosOfDamaged"
      },
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
    include: ["lossOfPersonalDocument"],
    id: "claimImages"
  },
  {
    question:
      "We are almost done to get you claim fast. I need your help to snap or upload some photos. Refer to the boxes below, try your best to snap/upload the right images for each box",
    responseType: "imageTable",
    columns: [
      { label: "Boarding pass/Flight itinerary", id: "boardingPass" },
      {
        label: "Original receipt for replacement of personal document",
        id: "replacementReceipt"
      },
      {
        label:
          "Original receipt for additional travelling and/or hotel accommodation ",
        id: "travelReceipt"
      },
      {
        label:
          "Document stating the compensation from airlines and/or other sources ",
        id: "compensationDocument"
      },
      {
        label: "Police report lodged within 24 hours (if any)",
        id: "policeReport"
      }
    ],
    id: "claimImages",
    include: ["lossOfPersonalDocument"]
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Scheduled and revised flight itinerary, or boarding pass",
        id: "boardingPass"
      },
      {
        label:
          "Written document from airline company stating the duration and cause of travel and/or baggage delay (for delays)",
        id: "delayDocumentFromAirline"
      },
      {
        label:
          "Original receipt for additional travelling and/or hotel accommodation (if any)",
        id: "travelReceipt"
      },
      {
        label:
          "Document stating the compensation from airlines and/or other sources (if any)",
        id: "compensationDocument"
      },
      {
        label:
          "Written document from airline company stating the cause of flight misconnection and stating there is no onward transportation available to you within 6 consecutive hours of your arrival time (for flight misconnection)",
        id: "flightMisconnectionDocument"
      },
      {
        label:
          "Property irregularity report and acknowledgement receipt of baggage received (for baggage delay)",
        id: "irregularityReport"
      }
    ],
    id: "claimImages",
    include: ["travelDelay"]
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Original receipt or invoice of deposit paid in advance by you ",
        id: "originalReceipt"
      },
      {
        label:
          "Written confirmation from airline, or hotel, or travel agency, or service provider indicating non-refundable amount due to unavoidable trip cancellation by you",
        id: "writtenConfirmation"
      },
      {
        label:
          "Terms and conditions from airline, or hotel, or travel agency, or service provider indicating non-refundable clause",
        id: "termsAndCondition"
      },
      {
        label:
          "Relationship proof of immediate family member if postponement of trip is due to serious injury/illness/death of immediate family member",
        id: "relationshipProof"
      },
      {
        label:
          "Original receipt for additional travelling and/or hotel accommodation (if any)",
        id: "travelReceipt"
      },
      {
        label: "Death certificate of immediate family member (if any)",
        id: "familyDeathCertificate"
      },
      {
        label:
          "Memo/letter from registered medical practitioner certifying your travel companion or immediate family member injury/illness is critical or life-threatening (if any)",
        id: "letterForTravelCompanion"
      },
      {
        label:
          "Memo/letter from registered medical practitioner certifying you are unfit to travel (if any)",
        id: "letterForSelf"
      }
    ],
    id: "claimImages",
    include: ["tripCurtailment"]
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Boarding pass / Flight itinerary",
        id: "boardingPass"
      },
      {
        label: "Tour itinerary",
        id: "tourItinerary"
      },
      {
        label: "Police report",
        id: "policeReport"
      },
      {
        label:
          "Document proof by third party for claiming bodily injury or property damage against you",
        id: "damageDocumentProof"
      },
      {
        label: "Any document that would help with this case (if any)",

        id: "anyDocument"
      }
    ],
    id: "claimImages",
    include: ["personalLiability"]
  },
  {
    question:
      "If you are now overseas and require any emergency assistance immediately, please call our 24-Hour HOTLINE +6569226009",
    responseType: null,
    include: ["others"]
  },
  {
    question:
      "We are almost done to get your claim paid fast. I need your help to snap or upload some supporting documents. Do your best to snap or upload the right images for each box",
    responseType: "imageTable",
    columns: [
      {
        label: "Boarding pass / Flight itinerary",
        id: "boardingPass"
      },
      {
        label: "Tour itinerary",
        id: "tourItinerary"
      },
      {
        label: "Police report",
        id: "policeReport"
      }
    ],
    id: "claimImages",
    include: ["others"]
  },
  {
    question:
      "FULLNAME, to complete your claim, I need your help to post all the ORIGINAL RECEIPTS to: HLAS, 11 Keppel Road #11-01 ABI Plaza Singapore 089057, within 48 hours",
    responseType: null
  },
  {
    question:
      "Thank you for your patience. Please keep this phone with you at all times, as I shall send you notifications and messages on your claim.",
    responseType: null
  }
]);
