// HACK: IN-MEMORY DATABASE FOR DEMO
export default (database = {
  policies: [
    {
      id: 11,
      status: "active",
      policyType: "travel",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      coverageSummary: [
        { label: "Accidental Death", value: "$50,000" },
        { label: "Permanent Disability", value: "$50,000" }
      ],
      premium: 15.66
    },
    {
      id: 12,
      status: "active",
      policyType: "pa_wi",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      coverageSummary: [
        { label: "Accidental Death", value: "$50,000" },
        { label: "Permanent Disability", value: "$50,000" }
      ],
      premium: 15.66
    },
    {
      id: 15,
      status: "expired",
      policyType: "travel",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      coverageSummary: [
        { label: "Accidental Death", value: "$200,000" },
        { label: "Overseas Medical Expenses", value: "$150,000" }
      ],
      premium: 10.99
    }
    // {
    //   id: 13,
    //   status: "active",
    //   policyType: "pa_mr",
    //   purchaseDate: new Date(2017, 5, 26, 16, 43),
    //   paid: 2.68
    // },
    // {
    //   id: 14,
    //   status: "expired",
    //   policyType: "pa",
    //   purchaseDate: new Date(2017, 5, 26, 16, 43),
    //   paid: 10.99
    // }
  ],
  claims: [
    {
      id: 12,
      status: "approved",
      policyType: "pa_mr",
      purchaseDate: new Date(2017, 3, 26, 16, 43),
      claimDate: new Date(2017, 5, 26, 16, 43),
      claimAmount: "5,600"
    },
    {
      id: 12,
      status: "approved",
      policyType: "pa_mr",
      purchaseDate: new Date(2017, 3, 26, 16, 43),
      claimDate: new Date(2017, 5, 26, 16, 43),
      claimAmount: "5,600"
    }
    // {
    //   id: 15,
    //   status: "paid",
    //   policyType: "pa_mr",
    //   purchaseDate: new Date(2017, 3, 26, 16, 43),
    //   claimDate: new Date(2017, 5, 26, 16, 43),
    //   claimAmount: 1000
    // }
    // {
    //   id: 16,
    //   status: "pending",
    //   policyType: "pa_wi",
    //   purchaseDate: new Date(2017, 3, 26, 16, 43),
    //   claimDate: new Date(2017, 5, 26, 16, 43),
    //   claimAmount: 1000
    // }
  ]
});
