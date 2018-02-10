// @flow
import "../mocks";
import "isomorphic-form-data";
import "isomorphic-fetch";

import { createInvoice, getInvoice } from "../../bitpay";

it("should create invoice correctly", () => {
  return createInvoice(15, "USD", {});
});
