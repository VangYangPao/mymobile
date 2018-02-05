import OCCUPATIONS from "./occupations";

const notCovered = [
  // "cashlessMedicalBenefit",
  // "naturalDisaster",
  "war",
  "mentalDisorder",
  "unlawfulAction",
  "influenceOfDrugOrAlcohol",
  "suicide",
  "dangerousSports",
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
    title: "Travel Umbrella",
    imageSource: "travel_protection",
    description:
      "At a super-low price, this is a super-big comprehensive plan that covers most of your financial loss and unforeseen expenses when you travel overseas. It covers you and your family's medical expenses, loss of baggage, loss of cash, and loss of home contents. You and your family enjoy unlimited emergency medical evacuation, cash compensation for flight delay, diversion or cancellation. In the event accidental death or permanent disability, your loved ones will receive a lump sum cash within days. These are just some highlights, and we are constantly adding more benefits and coverage to make you travel happily and peacefully!",
    // plans: [{ 0: 50000, premium: 35 }], // hardcoded for display purposes only
    plans: [
      {
        id: "1",
        legacyId: "basic",
        title: "Basic Plan",
        premium: 11
      },
      {
        id: "2",
        legacyId: "enhanced",
        title: "Premier Plan"
      },
      {
        id: "3",
        legacyId: "superior",
        title: "Elite Plan"
      }
      // {
      //   id: 85,
      //   legacyId: "premium",
      //   title: "Premium Plan"
      // }
    ],
    isTravelInsurance: true,
    from: "1 day",
    coverageHighlights: [
      "overseasMedicalExpenses",
      "postJourneyOverseasMedicalExpenses",
      "unlimitedEmergencyMedicalEvacuation"
    ],
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
    subclassName: null,
    endorsementFields: [
      // {
      //   label: "End Date",
      //   id: "endDate",
      //   responseType: "date",
      //   futureOnly: true
      // }
    ],
    renewable: false
  }
  // {
  //   id: "pa",
  //   title: "Micro PA Takaful",
  //   imageSource: "ad_pd",
  //   from: "2 weeks",
  //   plans: [
  //     // {
  //     //   title: "Plan A",
  //     //   premium: 2.68,
  //     //   coverage: {
  //     //     accidentalDeath: 5000,
  //     //     permanentDisablement: 5000
  //     //   }
  //     // },
  //     {
  //       id: 1,
  //       title: "Plan 1",
  //       premium: 0.5,
  //       coverage: {
  //         accidentalDeath: 10000,
  //         permanentDisablement: 10000
  //       }
  //     },
  //     {
  //       id: 2,
  //       title: "Plan 2",
  //       premium: 9.84,
  //       coverage: {
  //         accidentalDeath: 20000,
  //         permanentDisablement: 20000
  //       }
  //     },
  //     {
  //       id: 3,
  //       title: "Plan 3",
  //       premium: 17.87,
  //       coverage: {
  //         accidentalDeath: 40000,
  //         permanentDisablement: 40000
  //       }
  //     },
  //     {
  //       id: 4,
  //       title: "Plan 4",
  //       premium: 17.87,
  //       coverage: {
  //         accidentalDeath: 100000,
  //         permanentDisablement: 100000
  //       }
  //     },
  //     {
  //       id: 5,
  //       title: "Plan 5",
  //       premium: 17.87,
  //       coverage: {
  //         accidentalDeath: 100000,
  //         permanentDisablement: 100000
  //       }
  //     }
  //   ],
  //   covered: ["accidentalDeath", "permanentDisablement"],
  //   notCovered,
  //   ...paParseData
  // }
]);
