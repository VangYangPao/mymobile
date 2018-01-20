// @flow
export type PlanNameType = "1" | "2" | "3" | "4" | "5";
export type PlanDurationNameType = "A" | "B" | "C" | "D" | "E";
type CoverageNameType = "adpd" | "mr" | "wb" | "st";

type PlanType = {
  [CoverageNameType]: number
};
type PlanDurationType = {
  [PlanNameType]: PlanType
};
type PAPriceType = {
  [PlanDurationNameType]: PlanDurationType
};

const prices: PAPriceType = {
  A: {
    "1": {
      adpd: 0.5,
      mr: 3,
      wb: 0.25,
      st: 1.25
    },
    "2": {
      adpd: 1,
      mr: 4,
      wb: 0.31,
      st: 1.25
    },
    "3": {
      adpd: 2,
      mr: 5,
      wb: 0.38,
      st: 1.25
    },
    "4": {
      adpd: 4.5,
      mr: 6,
      wb: 0.42,
      st: 1.25
    },
    "5": {
      adpd: 8.5,
      mr: 8,
      wb: 0.48,
      st: 1.25
    }
  },

  B: {
    "1": {
      adpd: 1,
      mr: 5,
      wb: 1,
      st: 1.5
    },
    "2": {
      adpd: 2,
      mr: 7,
      wb: 2,
      st: 1.5
    },
    "3": {
      adpd: 4,
      mr: 10,
      wb: 2,
      st: 1.5
    },
    "4": {
      adpd: 9,
      mr: 12,
      wb: 2,
      st: 1.5
    },
    "5": {
      adpd: 17,
      mr: 15,
      wb: 2,
      st: 1.5
    }
  },

  C: {
    "1": {
      adpd: 3,
      mr: 15,
      wb: 3,
      st: 2
    },
    "2": {
      adpd: 7,
      mr: 22,
      wb: 4,
      st: 2
    },
    "3": {
      adpd: 13,
      mr: 30,
      wb: 5,
      st: 2
    },
    "4": {
      adpd: 26,
      mr: 37,
      wb: 5,
      st: 2
    },
    "5": {
      adpd: 52,
      mr: 44,
      wb: 6,
      st: 2
    }
  },

  D: {
    "1": {
      adpd: 7,
      mr: 29,
      wb: 6,
      st: 4
    },
    "2": {
      adpd: 13,
      mr: 44,
      wb: 8,
      st: 4
    },
    "3": {
      adpd: 26,
      mr: 59,
      wb: 9,
      st: 4
    },
    "4": {
      adpd: 52,
      mr: 73,
      wb: 10,
      st: 4
    },
    "5": {
      adpd: 104,
      mr: 88,
      wb: 12,
      st: 4
    }
  },
  C: {
    "1": {
      adpd: 3,
      mr: 15,
      wb: 3,
      st: 2
    },
    "2": {
      adpd: 7,
      mr: 22,
      wb: 4,
      st: 2
    },
    "3": {
      adpd: 13,
      mr: 30,
      wb: 5,
      st: 2
    },
    "4": {
      adpd: 26,
      mr: 37,
      wb: 5,
      st: 2
    },
    "5": {
      adpd: 52,
      mr: 44,
      wb: 6,
      st: 2
    }
  },

  E: {
    "1": {
      adpd: 13,
      mr: 58,
      wb: 12,
      st: 8
    },
    "2": {
      adpd: 26,
      mr: 88,
      wb: 15,
      st: 8
    },
    "3": {
      adpd: 52,
      mr: 117,
      wb: 18,
      st: 8
    },
    "4": {
      adpd: 103,
      mr: 146,
      wb: 20,
      st: 8
    },
    "5": {
      adpd: 207,
      mr: 175,
      wb: 23,
      st: 8
    }
  }
};
export default prices;
