// @flow
import moment from "moment";
import { getTravelPremium } from "../src/MY/controllers";

it("calculates single trip premium for IO correctly", () => {
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
});

it("calculates single trip premium for IS correctly", () => {
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
});

it("calculates single trip premium for IF correctly", () => {
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
});
