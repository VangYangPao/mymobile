export default (benefits = [
  {
    title: "Medical Expenses",
    coverage: [
      {
        title: "Overseas Medical Expenses",
        sections: [
          {
            title: "Adult (age 70 years and below)",
            benefitPayable: {
              basic: "$150,000",
              enhanced: "$250,000",
              superior: "$500,000"
            }
          },
          {
            title: "Adult (age above 70 years)",
            benefitPayable: {
              basic: "$50,000",
              enhanced: "$50,000",
              superior: "$100,000"
            }
          },
          {
            title: "Child",
            benefitPayable: {
              basic: "$100,000",
              enhanced: "$100,000",
              superior: "$100,000"
            }
          }
        ]
      },
      {
        title: "Medical Expenses in Singapore",
        sections: [
          {
            title: "Adult (age 70 years and below)",
            benefitPayable: {
              basic: "$10,000",
              enhanced: "$15,000",
              superior: "$20,000"
            }
          },
          {
            title: "Adult (age above 70 years)",
            benefitPayable: {
              basic: "$1,000",
              enhanced: "$1,500",
              superior: "$2,500"
            }
          },
          {
            title: "Child",
            benefitPayable: {
              basic: "$1,000",
              enhanced: "$1,500",
              superior: "$2,500"
            }
          }
        ]
      },
      {
        title: "Compassionate Visitᵃ",
        benefitPayable: {
          basic: "$3,000",
          enhanced: "$5,000",
          superior: "$10,000"
        }
      },
      {
        title: "Repatriation of Mortal Remainsᵃ",
        benefitPayable: {
          basic: "Unlimited",
          enhanced: "Unlimited",
          superior: "Unlimited"
        }
      },
      {
        title: "Overseas Funeral Expenses",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,500",
          superior: "$2,000"
        }
      },
      {
        title: "Return of Minor Childrenᵃ",
        benefitPayable: {
          basic: "$3,000",
          enhanced: "$5,000",
          superior: "$8,000"
        }
      },
      {
        title: "Emergency Medical Evacuationᵃ",
        benefitPayable: {
          basic: "Unlimited",
          enhanced: "Unlimited",
          superior: "Unlimited"
        }
      },
      {
        title: "Overseas Hospital Cash Benefit\n($200 per 24 hours)",
        benefitPayable: {
          basic: "$10,000",
          enhanced: "$15,000",
          superior: "$20,000"
        }
      },
      {
        title: "Hospital Cash Benefit in Singapore\n($200 per 24 hours)",
        benefitPayable: {
          basic: "$600",
          enhanced: "$1,000",
          superior: "$1,600"
        }
      }
    ]
  },
  {
    title: "Personal Accident",
    coverage: [
      {
        title: "Accidental Death & Permanent Disablement",
        sections: [
          {
            title: "Adult (age 70 years and below)",
            benefitPayable: {
              basic: "$200,000",
              enhanced: "$250,000",
              superior: "$300,000"
            }
          },
          {
            title: "Adult (age above 70 years)",
            benefitPayable: {
              basic: "$50,000",
              enhanced: "$50,000",
              superior: "50,000"
            }
          },
          {
            title: "Child",
            benefitPayable: {
              basic: "$50,0000",
              enhanced: "$50,000",
              superior: "$50,000"
            }
          }
        ]
      },
      {
        title: "Credit Card Outstanding Balance",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,500",
          superior: "$2,000"
        }
      },
      {
        title: "Cash Relief for Death due to Accident",
        benefitPayable: {
          basic: "$3,000",
          enhanced: "$4,000",
          superior: "$5,000"
        }
      }
    ]
  },
  {
    title: "Travel Inconvenience",
    coverage: [
      {
        title:
          "Loss of Baggage and Personal Effects\n($500 for each article or pair or set of article)",
        benefitPayable: {
          basic: "$3,000",
          enhanced: "$5,000",
          superior: "$7,000"
        }
      },
      {
        title: "Personal Money",
        benefitPayable: {
          basic: "$250",
          enhanced: "$250",
          superior: "$500"
        }
      },
      {
        title: "Personal Documents",
        benefitPayable: {
          basic: "$2,000",
          enhanced: "$3,000",
          superior: "$4,000"
        }
      },
      {
        title: "Emergency Phone Charges",
        benefitPayable: {
          basic: "$100",
          enhanced: "$100",
          superior: "$100"
        }
      },
      {
        title: "Delayed Baggage\n($100 for every 6 hours)",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,000",
          superior: "$1,000"
        }
      },
      {
        title: "Loss of Deposit or Cancellation of Trip",
        benefitPayable: {
          basic: "$5,000",
          enhanced: "$7,000",
          superior: "$12,000"
        }
      },
      {
        title: "Trip Curtailment",
        benefitPayable: {
          basic: "$3,000",
          enhanced: "$5,000",
          superior: "$8,000"
        }
      },
      {
        title: "Travel Delay\n($100 for every 6 hours)",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,000",
          superior: "$1,000"
        }
      },
      {
        title: "Travel Postponement",
        benefitPayable: {
          basic: "$500",
          enhanced: "$1,000",
          superior: "$1,500"
        }
      },
      {
        title: "Travel Misconnections\n($100 for every 6 hours)",
        benefitPayable: {
          basic: "$200",
          enhanced: "$200",
          superior: "$200"
        }
      },
      {
        title: "Flight Overbooked\n($100 for every 6 hours)",
        benefitPayable: {
          basic: "$100",
          enhanced: "$100",
          superior: "$100"
        }
      },
      {
        title: "Flight Diversion\n($100 for every 6 hours)",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,000",
          superior: "$1,000"
        }
      },
      {
        title: "Insolvency of Travel Agency",
        benefitPayable: {
          basic: "$2,000",
          enhanced: "$3,000",
          superior: "$4,000"
        }
      }
    ]
  },
  {
    title: "Liability",
    coverage: [
      {
        title: "Personal Liability",
        benefitPayable: {
          basic: "$500,000",
          enhanced: "$500,000",
          superior: "$1,000,000"
        }
      }
    ]
  },
  {
    title: "Lifestyle",
    coverage: [
      {
        title: "Loss of Home Contents due to Burglary",
        benefitPayable: {
          basic: "$1,000",
          enhanced: "$1,500",
          superior: "$2,000"
        }
      },
      {
        title: 'Golfing "Hole in One"',
        benefitPayable: {
          basic: "$150",
          enhanced: "$250",
          superior: "$350"
        }
      },
      {
        title: "Rental Car Excess",
        benefitPayable: {
          basic: "$500",
          enhanced: "$750",
          superior: "$1,000"
        }
      }
    ]
  }
]);
