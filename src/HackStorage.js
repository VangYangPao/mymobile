// HACK: IN-MEMORY DATABASE FOR DEMO
export default (database = {
  policies: [
    {
      id: 12,
      status: "active",
      policyType: "travel",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      paid: 5.66
    },
    {
      id: 15,
      status: "active",
      policyType: "mobile",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      paid: 10.99
    },
    {
      id: 13,
      status: "active",
      policyType: "pa_mr",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      paid: 2.68
    },
    {
      id: 14,
      status: "expired",
      policyType: "pa",
      purchaseDate: new Date(2017, 5, 26, 16, 43),
      paid: 10.99
    }
  ],
  claims: [
    {
      id: 15,
      status: "paid",
      policyType: "pa_wi",
      purchaseDate: new Date(2017, 3, 26, 16, 43),
      claimDate: new Date(2017, 5, 26, 16, 43),
      claimAmount: 1000
    },
    {
      id: 16,
      status: "pending",
      policyType: "pa_wi",
      purchaseDate: new Date(2017, 3, 26, 16, 43),
      claimDate: new Date(2017, 5, 26, 16, 43),
      claimAmount: 1000
    }
  ]
});
