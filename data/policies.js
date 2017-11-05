import OCCUPATIONS from "./occupations";

const notCovered = [
  "cashlessMedicalBenefit",
  "naturalDisaster",
  "warOrTerrorism",
  "mentalDisorder",
  "unlawfulAction",
  "influenceOfDrugOrAlcohol",
  "suicide",
  "preExistingConditions"
];

const paParseData = {
  renewable: true,
  subclassName: "PurchaseAccident",
  endorsementFields: [
    {
      label: "Occupation",
      id: "occupationId",
      responseType: ["choice", "number"],
      choices: OCCUPATIONS
    }
  ]
};

export default (policies = [
  {
    id: "travel",
    title: "Travel Protect360",
    imageSource: "ic_travel_protection",
    description:
      "At a super-low price, this is a super-big comprehensive plan that covers most of your financial loss and unforeseen expenses when you travel overseas. It covers you and your family's medical expenses, loss of baggage, loss of cash, and loss of home contents. You and your family enjoy unlimited emergency medical evacuation, cash compensation for flight delay, diversion or cancellation. In the event accidental death or permanent disability, your loved ones will receive a lump sum cash within days. These are just some highlights, and we are constantly adding more benefits and coverage to make you travel happily and peacefully!",
    plans: [{ 0: 50000, premium: 35 }], // hardcoded for display purposes only
    isTravelInsurance: true,
    from: "1 day",
    covered: [
      "overseasMedicalExpenses",
      "medicalExpensesInSG",
      "repatriationOfMortalRemains",
      "emergencyMedicalEvacuation",
      "overseasCashBenefit",
      "hospitalCashBenefitInSG",
      "overseasAccidentalDeath",
      "overseasPermanentDisablement",
      "lossOfBaggage",
      "lossOfMoney",
      "delayedBaggage",
      "travelCancellation",
      "tripCurtailment",
      "travelDelay",
      "flightDiversion",
      "insolvencyOfTravelAgency",
      "personalLiability",
      "lossOfHomeContents"
    ],
    notCovered,
    subclassName: "PurchaseTravel",
    endorsementFields: [
      {
        label: "End Date",
        id: "endDate",
        responseType: "date",
        futureOnly: true
      }
    ],
    renewable: false
  },
  {
    id: "pa",
    title: "Micro Protect360",
    imageSource: "ic_ad_pd",
    from: "1 month",
    plans: [
      // {
      //   title: "Plan A",
      //   premium: 2.68,
      //   coverage: {
      //     accidentalDeath: 5000,
      //     permanentDisablement: 5000
      //   }
      // },
      {
        title: "Plan A",
        premium: 5.35,
        coverage: {
          accidentalDeath: 10000,
          permanentDisablement: 10000
        }
      },
      {
        title: "Plan B",
        premium: 9.84,
        coverage: {
          accidentalDeath: 20000,
          permanentDisablement: 20000
        }
      },
      {
        title: "Plan C",
        premium: 17.87,
        coverage: {
          accidentalDeath: 40000,
          permanentDisablement: 40000
        }
      },
      {
        title: "Plan D",
        premium: 17.87,
        coverage: {
          accidentalDeath: 40000,
          permanentDisablement: 40000
        }
      }
    ],
    covered: ["accidentalDeath", "permanentDisablement"],
    notCovered,
    ...paParseData
  },
  {
    id: "pa_mr",
    title: "Micro Protect360 with Medical Reimbursement",
    subtitle: "Up to $10,000",
    imageSource: "ic_ad_pd_medical_reimbursement",
    from: "1 month",
    plans: [
      // {
      //   title: "Plan A",
      //   coverage: {
      //     accidentalDeath: 5000,
      //     permanentDisablement: 5000,
      //     medicalReimbursement: 500
      //   },
      //   premium: 2.68
      // },
      {
        title: "Plan A",
        coverage: {
          accidentalDeath: 10000,
          permanentDisablement: 10000,
          medicalReimbursement: 1000
        },
        premium: 5.35
      },
      {
        title: "Plan B",
        coverage: {
          accidentalDeath: 20000,
          permanentDisablement: 20000,
          medicalReimbursement: 1500
        },
        premium: 9.84
      },
      {
        title: "Plan C",
        coverage: {
          accidentalDeath: 40000,
          permanentDisablement: 40000,
          medicalReimbursement: 2000
        },
        premium: 17.87
      },
      {
        title: "Plan D",
        coverage: {
          accidentalDeath: 100000,
          permanentDisablement: 100000,
          medicalReimbursement: 3000
        },
        premium: 40.98
      }
    ],
    covered: [
      "accidentalDeath",
      "permanentDisablement",
      "medicalReimbursement",
      "mrFoodPoisoning",
      "mrMosquitoBite"
    ],
    notCovered,
    ...paParseData
  },
  {
    id: "pa_wi",
    title: "Micro Protect360 with Weekly Indemnity",
    subtitle: "Requires medical record (TCM / Physiotherapy)",
    imageSource: "ic_ad_pd_weekly_indemnity",
    from: "1 month",
    plans: [
      // {
      //   title: "Plan A",
      //   coverage: {
      //     accidentalDeath: 5000,
      //     permanentDisablement: 5000,
      //     weeklyIndemnity: 200
      //   },
      //   premium: 2.2
      // },
      {
        title: "Plan A",
        coverage: {
          accidentalDeath: 10000,
          permanentDisablement: 10000,
          weeklyIndemnity: 250
        },
        premium: 4.09
      },
      {
        title: "Plan B",
        coverage: {
          accidentalDeath: 20000,
          permanentDisablement: 20000,
          weeklyIndemnity: 300
        },
        premium: 7.75
      },
      {
        title: "Plan C",
        coverage: {
          accidentalDeath: 40000,
          permanentDisablement: 40000,
          weeklyIndemnity: 350
        },
        premium: 14.97
      },
      {
        title: "Plan D",
        coverage: {
          accidentalDeath: 100000,
          permanentDisablement: 100000,
          weeklyIndemnity: 400
        },
        premium: 36.42
      }
    ],
    covered: ["accidentalDeath", "permanentDisablement", "weeklyIndemnity"],
    notCovered,
    ...paParseData
  },
  {
    id: "mobile",
    title: "Phone Protect360",
    imageSource: "ic_phone_protection",
    from: "1 year",
    plans: [
      {
        title: "Annual Plan",
        coverage: {
          accidentalDamage: 1000,
          waterDamage: 1000
        },
        premium: 12.84 * 0.9
      }
    ],
    covered: ["phoneDamage", "phoneWet"],
    notCovered: ["phoneCosmetic", "phoneWearTear", "selfInflicted"],
    subclassName: "PurchasePhone",
    endorsementFields: [],
    renewable: true
  }
]);
