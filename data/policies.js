export default (policies = [
  {
    title: "Accidental Death / Permanent Disability",
    imageSource: "ic_ad_pd",
    plans: [
      {
        coverageAmount: 5000,
        premium: 2.68
      },
      {
        coverageAmount: 10000,
        premium: 5.35
      },
      {
        coverageAmount: 20000,
        premium: 9.84
      },
      {
        coverageAmount: 40000,
        premium: 17.87
      },
      {
        coverageAmount: 100000,
        premium: 40.98
      }
    ],
    covered: ["Accidental Death", "Accidental Permanent Disability"],
    notCovered: [
      "Disability Income",
      "Cashless Medical Coverage",
      "War or Terrorism",
      "Pregnancy or Miscarriage",
      "Suicide or Self-inflicted Injury",
      "Dangerous Sports"
    ]
  },
  {
    title: "Accidental Death / Permanent Disability with Medical Reimbursement",
    subtitle: "Up to $10,000",
    imageSource: "ic_ad_pd_medical_reimbursement",
    plans: [
      {
        coverageAmount: 5000,
        premium: 2.68
      },
      {
        coverageAmount: 10000,
        premium: 5.35
      },
      {
        coverageAmount: 20000,
        premium: 9.84
      },
      {
        coverageAmount: 40000,
        premium: 17.87
      },
      {
        coverageAmount: 100000,
        premium: 40.98
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Medical Reimbursement (Medical Benefit)"
    ],
    notCovered: [
      "Disability Income",
      "Cashless Medical Coverage",
      "War or Terrorism",
      "Pregnancy or Miscarriage",
      "Suicide or Self-inflicted Injury",
      "Dangerous Sports"
    ]
  },
  {
    title: "Accidental Death / Permanent Disability with Weekly Indemnity",
    subtitle: "Requires medical record (TCM / Physiotherapy)",
    imageSource: "ic_ad_pd_weekly_indemnity",
    plans: [
      {
        coverageAmount: 5000,
        premium: 2.20
      },
      {
        coverageAmount: 10000,
        premium: 4.09
      },
      {
        coverageAmount: 20000,
        premium: 7.75
      },
      {
        coverageAmount: 40000,
        premium: 14.97
      },
      {
        coverageAmount: 100000,
        premium: 36.42
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Weekly Indemnity (Accident Benefit)"
    ],
    notCovered: [
      "Disability Income",
      "Cashless Medical Coverage",
      "War or Terrorism",
      "Pregnancy or Miscarriage",
      "Suicide or Self-inflicted Injury",
      "Dangerous Sports"
    ]
  },
  {
    title: "Phone Protection",
    imageSource: "ic_phone_protection",
    plans: [
      {
        coverageAmount: 1000,
        premium: 12.84
      }
    ],
    covered: ["Phone Cracked / Dropped", "Phone On Wet Surface / Blank Screen"],
    notCovered: []
  }
]);
