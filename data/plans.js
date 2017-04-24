export default (plans = [
  {
    title: "Personal Accident",
    subtitle: "Up to $10,000",
    iconName: "directions-car",
    pricePerMonth: 8,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: [
      { inWeeks: 2, readable: "2w" },
      { inWeeks: 4, readable: "4w" },
      { inWeeks: 12, readable: "3m" },
      { inWeeks: 24, readable: "6m" },
      { inWeeks: 48, readable: "12m" }
    ]
  },
  {
    title: "Personal accident /w Weekly Indemnities",
    subtitle: "Up to $10,000",
    iconName: "healing",
    pricePerMonth: 9,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: [
      { inWeeks: 2, readable: "2w" },
      { inWeeks: 4, readable: "4w" },
      { inWeeks: 12, readable: "3m" },
      { inWeeks: 24, readable: "6m" },
      { inWeeks: 48, readable: "12m" }
    ]
  },
  {
    title: "Snatch theft",
    subtitle: "Up to $10,000",
    iconName: "account-balance-wallet",
    pricePerMonth: 10,
    coverageAmounts: [5000, 10000, 20000, 40000, 100000],
    coverageDurations: [
      { inWeeks: 2, readable: "2w" },
      { inWeeks: 4, readable: "4w" },
      { inWeeks: 12, readable: "3m" },
      { inWeeks: 24, readable: "6m" },
      { inWeeks: 48, readable: "12m" }
    ]
  }
]);
