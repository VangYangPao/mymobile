export default (policies = [
  {
    title: "Accidental Death / Permanent Disability",
    imageSource: "ic_ad_pd",
    plans: [
      {
        coverageAmount: 10000,
        premium: 4.99
      },
      {
        coverageAmount: 20000,
        premium: 9.98
      },
      {
        coverageAmount: 50000,
        premium: 24.95
      },
      {
        coverageAmount: 100000,
        premium: 49.91
      }
    ],
    covered: ["Accidental Death", "Accidental Permanent Disability"],
    notCovered: ["Disability Income", "Cashless Medical Coverage"]
  },
  {
    title: "Accidental Death / Permanent Disability with Medical Reimbursement",
    subtitle: "Up to $10,000",
    imageSource: "ic_ad_pd_medical_reimbursement",
    plans: [
      {
        coverageAmount: 10000,
        premium: 4.99
      },
      {
        coverageAmount: 20000,
        premium: 9.98
      },
      {
        coverageAmount: 50000,
        premium: 24.95
      },
      {
        coverageAmount: 100000,
        premium: 49.91
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Medical Reimbursement (Medical Benefit)"
    ],
    notCovered: ["Disability Income", "Cashless Medical Coverage"]
  },
  {
    title: "Accidental Death / Permanent Disability with Weekly Indemnity",
    subtitle: "Requires medical record (TCM / Physiotherapy)",
    imageSource: "ic_ad_pd_weekly_indemnity",
    plans: [
      {
        coverageAmount: 1000,
        premium: 4.99
      },
      {
        coverageAmount: 2000,
        premium: 9.98
      },
      {
        coverageAmount: 5000,
        premium: 24.95
      },
      {
        coverageAmount: 10000,
        premium: 49.91
      }
    ],
    covered: [
      "Accidental Death",
      "Accidental Permanent Disability",
      "Weekly Indemnity (Accident Benefit)"
    ],
    notCovered: ["Disability Income", "Cashless Medical Coverage"]
  },
  {
    title: "Phone Protection",
    imageSource: "ic_phone_protection",
    plans: [
      {
        coverageAmount: 1000,
        premium: 4.99
      },
      {
        coverageAmount: 2000,
        premium: 9.98
      },
      {
        coverageAmount: 5000,
        premium: 24.95
      },
      {
        coverageAmount: 10000,
        premium: 49.91
      }
    ],
    covered: ["Phone Cracked / Dropped", "Phone On Wet Surface / Blank Screen"],
    notCovered: []
  }
]);
