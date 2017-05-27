const notCovered = [
  "Disability Income",
  "Cashless Medical Coverage",
  "War or Terrorism",
  "Pregnancy or Miscarriage",
  "Suicide or Self-inflicted Injury",
  "Dangerous Sports"
];

export default (policies = [
  {
    title: "Accidental Death / Permanent Disability",
    imageSource: "ic_ad_pd",
    plans: [
      {
        accidentalDeath: 5000,
        permanentDisablement: 5000,
        premium: 2.68
      },
      {
        accidentalDeath: 10000,
        permanentDisablement: 10000,
        premium: 5.35
      },
      {
        accidentalDeath: 20000,
        permanentDisablement: 20000,
        premium: 9.84
      },
      {
        accidentalDeath: 40000,
        permanentDisablement: 40000,
        premium: 17.87
      },
      {
        accidentalDeath: 100000,
        permanentDisablement: 100000,
        premium: 40.98
      }
    ],
    covered: ["Accidental Death", "Accidental Permanent Disability"],
    notCovered
  },
  {
    title: "Accidental Death / Permanent Disability with Medical Reimbursement",
    subtitle: "Up to $10,000",
    imageSource: "ic_ad_pd_medical_reimbursement",
    plans: [
      {
        accidentalDeath: 5000,
        permanentDisablement: 5000,
        medicalReimbursement: 500,
        premium: 2.68
      },
      {
        accidentalDeath: 10000,
        permanentDisablement: 10000,
        medicalReimbursement: 1000,
        premium: 5.35
      },
      {
        accidentalDeath: 20000,
        permanentDisablement: 20000,
        medicalReimbursement: 1500,
        premium: 9.84
      },
      {
        accidentalDeath: 40000,
        permanentDisablement: 40000,
        medicalReimbursement: 2000,
        premium: 17.87
      },
      {
        accidentalDeath: 100000,
        permanentDisablement: 100000,
        medicalReimbursement: 3000,
        premium: 40.98
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Medical Reimbursement (Medical Benefit)"
    ],
    notCovered
  },
  {
    title: "Accidental Death / Permanent Disability with Weekly Indemnity",
    subtitle: "Requires medical record (TCM / Physiotherapy)",
    imageSource: "ic_ad_pd_weekly_indemnity",
    plans: [
      {
        accidentalDeath: 5000,
        permanentDisablement: 5000,
        weeklyIndemnity: 200,
        premium: 2.20
      },
      {
        accidentalDeath: 10000,
        permanentDisablement: 10000,
        weeklyIndemnity: 250,
        premium: 4.09
      },
      {
        accidentalDeath: 20000,
        permanentDisablement: 20000,
        weeklyIndemnity: 300,
        premium: 7.75
      },
      {
        accidentalDeath: 40000,
        permanentDisablement: 40000,
        weeklyIndemnity: 350,
        premium: 14.97
      },
      {
        accidentalDeath: 100000,
        permanentDisablement: 100000,
        weeklyIndemnity: 400,
        premium: 36.42
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Weekly Indemnity (Accident Benefit)"
    ],
    notCovered
  },
  {
    title: "Phone Protection",
    imageSource: "ic_phone_protection",
    plans: [
      {
        accidentalDamage: 1000,
        waterDamage: 1000,
        premium: 12.84
      }
    ],
    covered: ["Phone Cracked / Dropped", "Phone On Wet Surface / Blank Screen"],
    notCovered: []
  }
  // {
  //   title: "Travel Protection",
  //   imageSource: "ic_dangerous_sport",
  //   plans: [],
  //   covered: [
  //     "Overseas medical expenses",
  //     "Medical expenses",
  //     "Emergency medical evacuation",
  //     "Accidental Death",
  //     "Accidental Permanent Disability",
  //     "Loss of benefit, personal effect, cash",
  //     "Delayed baggage and flight",
  //     "Loss or cancellation of trip",
  //     "Personal liability",
  //     "Loss of home contents due to burglary"
  //   ],
  //   notCovered
  // }
]);
