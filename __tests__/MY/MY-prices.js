// @flow
import moment from "moment";
import { getTravelPremium, getPAPremium } from "../src/MY/premiums";

it("calculates premium for IO correctly", () => {
  const startDate = new Date();
  let endDate = moment(new Date())
    .add(1, "day")
    .toDate();
  let premium = getTravelPremium(
    startDate,
    endDate,
    false,
    false,
    false,
    0,
    1,
    2
  );
  expect(premium).toEqual(11);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(32);

  endDate = moment(new Date())
    .add(6, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 1, 2);
  expect(premium).toEqual(16);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(47);

  endDate = moment(new Date())
    .add(11, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 1, 2);
  expect(premium).toEqual(24);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(71);

  endDate = moment(new Date())
    .add(19, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 1, 2);
  expect(premium).toEqual(30);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(88);

  endDate = moment(new Date())
    .add(31 + 7, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 1, 2);
  expect(premium).toEqual(30 + 8);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(88 + 22);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 1, 2);
  expect(premium).toEqual(30 + 8 * 2);
  premium = getTravelPremium(startDate, endDate, false, false, false, 0, 3, 4);
  expect(premium).toEqual(88 + 22 * 2);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, true, false, false, 0, 1, 2);
  expect(premium).toEqual(10);
  premium = getTravelPremium(startDate, endDate, true, false, false, 0, 3, 4);
  expect(premium).toEqual(28);

  expect(() => {
    endDate = moment(new Date())
      .add(31 + 14, "day")
      .toDate();
    premium = getTravelPremium(startDate, endDate, true, true, false, 0, 1, 2);
    expect(premium).toEqual(10);
  }).toThrow();

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, true, false, 0, 1, 2);
  expect(premium).toEqual(78);
  premium = getTravelPremium(startDate, endDate, false, true, false, 0, 3, 4);
  expect(premium).toEqual(230);
});

it("calculates premium for IS correctly", () => {
  const startDate = new Date();
  let endDate = moment(new Date())
    .add(1, "day")
    .toDate();
  let premium = getTravelPremium(
    startDate,
    endDate,
    false,
    false,
    true,
    0,
    1,
    2
  );
  expect(premium).toEqual(22);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(64);

  endDate = moment(new Date())
    .add(6, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 1, 2);
  expect(premium).toEqual(32);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(94);

  endDate = moment(new Date())
    .add(11, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 1, 2);
  expect(premium).toEqual(48);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(142);

  endDate = moment(new Date())
    .add(19, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 1, 2);
  expect(premium).toEqual(60);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(176);

  endDate = moment(new Date())
    .add(31 + 7, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 1, 2);
  expect(premium).toEqual(60 + 16);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(176 + 44);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 1, 2);
  expect(premium).toEqual(60 + 16 * 2);
  premium = getTravelPremium(startDate, endDate, false, false, true, 0, 3, 4);
  expect(premium).toEqual(176 + 44 * 2);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, true, false, true, 0, 1, 2);
  expect(premium).toEqual(20);
  premium = getTravelPremium(startDate, endDate, true, false, true, 0, 3, 4);
  expect(premium).toEqual(56);

  expect(() => {
    endDate = moment(new Date())
      .add(31 + 14, "day")
      .toDate();
    premium = getTravelPremium(startDate, endDate, true, true, true, 0, 1, 2);
  }).toThrow();

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, true, true, 0, 1, 2);
  expect(premium).toEqual(156);
  premium = getTravelPremium(startDate, endDate, false, true, true, 0, 3, 4);
  expect(premium).toEqual(460);
});

it("calculates premium for IF correctly", () => {
  const startDate = new Date();
  let endDate = moment(new Date())
    .add(1, "day")
    .toDate();
  let premium = getTravelPremium(
    startDate,
    endDate,
    false,
    false,
    true,
    4,
    1,
    2
  );
  expect(premium).toEqual(27);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(80);

  endDate = moment(new Date())
    .add(6, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 1, 2);
  expect(premium).toEqual(39);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(115);

  endDate = moment(new Date())
    .add(11, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 1, 2);
  expect(premium).toEqual(59);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(173);

  endDate = moment(new Date())
    .add(19, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 1, 2);
  expect(premium).toEqual(73);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(216);

  endDate = moment(new Date())
    .add(31 + 7, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 1, 2);
  expect(premium).toEqual(73 + 18);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(216 + 54);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 1, 2);
  expect(premium).toEqual(73 + 18 * 2);
  premium = getTravelPremium(startDate, endDate, false, false, true, 4, 3, 4);
  expect(premium).toEqual(216 + 54 * 2);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, true, false, true, 4, 1, 2);
  expect(premium).toEqual(24);
  premium = getTravelPremium(startDate, endDate, true, false, true, 4, 3, 4);
  expect(premium).toEqual(69);

  expect(() => {
    endDate = moment(new Date())
      .add(31 + 14, "day")
      .toDate();
    premium = getTravelPremium(startDate, endDate, true, true, true, 4, 1, 2);
  }).toThrow();

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, true, true, 4, 1, 2);
  expect(premium).toEqual(192);
  premium = getTravelPremium(startDate, endDate, false, true, true, 4, 3, 4);
  expect(premium).toEqual(564);
});

it("calculates premium for IF with additional child correctly", () => {
  const startDate = new Date();
  let endDate = moment(new Date())
    .add(1, "day")
    .toDate();
  let premium = getTravelPremium(
    startDate,
    endDate,
    false,
    false,
    true,
    5,
    1,
    2
  );
  expect(premium).toEqual(27 + 4);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(80 + 10);

  endDate = moment(new Date())
    .add(6, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 1, 2);
  expect(premium).toEqual(39 + 5);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(115 + 14);

  endDate = moment(new Date())
    .add(11, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 1, 2);
  expect(premium).toEqual(59 + 8);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(173 + 22);

  endDate = moment(new Date())
    .add(19, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 1, 2);
  expect(premium).toEqual(73 + 9);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(216 + 27);

  endDate = moment(new Date())
    .add(31 + 7, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 1, 2);
  expect(premium).toEqual(73 + 18 + 9 + 2);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(216 + 54 + 27 + 7);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 1, 2);
  expect(premium).toEqual(73 + 18 * 2 + 9 + 2 * 2);
  premium = getTravelPremium(startDate, endDate, false, false, true, 5, 3, 4);
  expect(premium).toEqual(216 + 54 * 2 + 27 + 7 * 2);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, true, false, true, 5, 1, 2);
  expect(premium).toEqual(24 + 3);
  premium = getTravelPremium(startDate, endDate, true, false, true, 5, 3, 4);
  expect(premium).toEqual(69 + 9);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, true, false, true, 6, 1, 2);
  expect(premium).toEqual(24 + 3 * 2);
  premium = getTravelPremium(startDate, endDate, true, false, true, 6, 3, 4);
  expect(premium).toEqual(69 + 9 * 2);

  expect(() => {
    endDate = moment(new Date())
      .add(31 + 14, "day")
      .toDate();
    premium = getTravelPremium(startDate, endDate, true, true, true, 6, 1, 2);
  }).toThrow();

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, true, true, 6, 1, 2);
  expect(premium).toEqual(192 + 24 * 2);
  premium = getTravelPremium(startDate, endDate, false, true, true, 6, 3, 4);
  expect(premium).toEqual(564 + 70 * 2);

  endDate = moment(new Date())
    .add(31 + 14, "day")
    .toDate();
  premium = getTravelPremium(startDate, endDate, false, true, true, 6, 1, 2);
  expect(premium).toEqual(192 + 24 * 2);
  premium = getTravelPremium(startDate, endDate, false, true, true, 6, 3, 4);
  expect(premium).toEqual(564 + 70 * 2);
});

it("should calculate basic coverage premium for PA", () => {
  let premium = getPAPremium("A", "1", false, false, false);
  expect(premium).toEqual(0.5);
  premium = getPAPremium("E", "5", false, false, false);
  expect(premium).toEqual(207);

  // ADPD + MR
  premium = getPAPremium("A", "1", true, false, false);
  expect(premium).toEqual(0.5 + 3);
  premium = getPAPremium("E", "5", true, false, false);
  expect(premium).toEqual(207 + 175);

  // ADPD + MR + WB
  premium = getPAPremium("A", "1", true, true, false);
  expect(premium).toEqual(0.5 + 3 + 0.25);
  premium = getPAPremium("E", "5", true, true, false);
  expect(premium).toEqual(207 + 175 + 23);

  // ADPD + MR + WB + ST
  premium = getPAPremium("A", "1", true, true, true);
  expect(premium).toEqual(0.5 + 3 + 0.25 + 1.25);
  premium = getPAPremium("E", "5", true, true, true);
  expect(premium).toEqual(207 + 175 + 23 + 8);

  // ADPD + WB + ST
  premium = getPAPremium("A", "1", false, true, true);
  expect(premium).toEqual(0.5 + 0.25 + 1.25);
  premium = getPAPremium("E", "5", false, true, true);
  expect(premium).toEqual(207 + 23 + 8);

  // ADPD + ST
  premium = getPAPremium("A", "1", false, false, true);
  expect(premium).toEqual(0.5 + 1.25);
  premium = getPAPremium("E", "5", false, false, true);
  expect(premium).toEqual(207 + 8);
});
