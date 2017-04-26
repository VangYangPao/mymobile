export default (plans = [
  {
    title: "Personal Accident",
    subtitle: "Up to $10,000",
    iconName: "directions-car",
    pricePerMonth: 8,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: ["1m", "2m", "3m", "6m", "12m"],
    covered: [
      { title: "Health problems", icon: "ios-medkit" },
      { title: "Vehicle accidents", icon: "ios-car" }
    ],
    notCovered: [
      { title: "Flood", icon: "md-water" },
      { title: "Vicious dogs", icon: "ios-paw" }
    ]
  },
  {
    title: "Personal accident /w Weekly Indemnities",
    subtitle: "Up to $10,000",
    iconName: "healing",
    pricePerMonth: 9,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: ["1m", "2m", "3m", "6m", "12m"],
    covered: [
      { title: "Health problems", icon: "ios-medkit" },
      { title: "Vehicle accidents", icon: "ios-car" }
    ],
    notCovered: [
      { title: "Flood", icon: "md-water" },
      { title: "Vicious dogs", icon: "ios-paw" }
    ]
  },
  {
    title: "Personal accident /w Medical Reimbursement",
    subtitle: "Up to $10,000",
    iconName: "local-hospital",
    pricePerMonth: 9,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: ["1m", "2m", "3m", "6m", "12m"],
    covered: [
      { title: "Health problems", icon: "ios-medkit" },
      { title: "Vehicle accidents", icon: "ios-car" }
    ],
    notCovered: [
      { title: "Flood", icon: "md-water" },
      { title: "Vicious dogs", icon: "ios-paw" }
    ]
  },
  {
    title: "Snatch theft",
    subtitle: "Up to $10,000",
    iconName: "account-balance-wallet",
    pricePerMonth: 10,
    coverageAmounts: [2000],
    coverageDurations: ["1m", "2m", "3m", "6m", "12m"],
    covered: [
      { title: "Health problems", icon: "ios-medkit" },
      { title: "Vehicle accidents", icon: "ios-car" }
    ],
    notCovered: [
      { title: "Flood", icon: "md-water" },
      { title: "Vicious dogs", icon: "ios-paw" }
    ]
  }
]);
