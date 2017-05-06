export default (policies = [
    {
        title: "Accidental Death",
        subtitle: "Up to $10,000",
        iconName: "directions-car",
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
            },
        ],
        covered: ["Health problems", "Vehicle accidents"],
        notCovered: ["Flood", "Family"]
    },
    {
        title: "Permanent Disablement",
        subtitle: "Up to $10,000",
        iconName: "healing",
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
            },
        ],
        covered: ["Health problems", "Vehicle accidents"],
        notCovered: ["Flood", "Family"]
    },
    {
        title: "Medical Benefit",
        subtitle: "Requires medical record (TCM / Physiotherapy)",
        iconName: "local-hospital",
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
            },
        ],
        covered: ["Health problems", "Vehicle accidents"],
        notCovered: ["Flood", "Family"]
    },
    {
        title: "Hospitalization Benefit",
        subtitle: "Due to accident only",
        iconName: "account-balance-wallet",
        plans: [
            {
                coverageAmount: 5000,
                premium: 4.99
            },
            {
                coverageAmount: 10000,
                premium: 9.98
            },
            {
                coverageAmount: 25000,
                premium: 24.95
            },
            {
                coverageAmount: 50000,
                premium: 49.91
            },
        ],
        covered: ["Health problems", "Vehicle accidents"],
        notCovered: ["Flood", "Family"]
    }
]);
