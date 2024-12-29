import * as assert from "assert";
import {
  getHostGuests,
  getGuestRange,
  getGuestMax,
  getGuestMin,
  getTotalFamily,
  Guest,
  parseGuest,
} from "./guest";

describe("guest", function () {
  const g0: Guest = {
    name: "joob",
    guestOf: "Molly",
    isFamily: ", family",
    restriction: "",
    p1: "0",
    p1Name: "",
    p1Restriction: "",
  };
  const g1: Guest = {
    name: "julia",
    guestOf: "Molly",
    isFamily: ", family",
    restriction: "",
    p1: "1",
    p1Name: "",
    p1Restriction: "",
  };
  const g2: Guest = {
    name: "bobby",
    guestOf: "Molly",
    isFamily: "",
    restriction: "",
    p1: "1?",
    p1Name: "",
    p1Restriction: "",
  };
  const g3: Guest = {
    name: "bubby",
    guestOf: "James",
    isFamily: ", family",
    restriction: "",
    p1: "0",
    p1Name: "",
    p1Restriction: "",
  };
  const g4: Guest = {
    name: "beth",
    guestOf: "James",
    isFamily: "",
    restriction: "",
    p1: "1",
    p1Name: "",
    p1Restriction: "",
  };
  const g5: Guest = {
    name: "beth2",
    guestOf: "James",
    isFamily: "",
    restriction: "",
    p1: "1?",
    p1Name: "",
    p1Restriction: "",
  };

  it("getTotalFamily", function () {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(getTotalFamily([]), 0);
    // 0-1-many: 1 recursive call, subdomain 1 (fam)
    assert.deepStrictEqual(getTotalFamily([g1]), 1);
    assert.deepStrictEqual(getTotalFamily([g3]), 1);
    // 0-1-many: 1 recursive call, subdomain 2 (no fam)
    assert.deepStrictEqual(getTotalFamily([g2]), 0);
    assert.deepStrictEqual(getTotalFamily([g4]), 0);
    // 0-1-many: 2+ recursive calls, subdomain 1 (fam -> fam)
    assert.deepStrictEqual(getTotalFamily([g1, g3]), 2);
    assert.deepStrictEqual(getTotalFamily([g3, g1]), 2);
    // 0-1-many: 2+ recursive calls, subdomain 2 (fam -> no fam)
    assert.deepStrictEqual(getTotalFamily([g1, g2]), 1);
    assert.deepStrictEqual(getTotalFamily([g3, g4]), 1);
    // 0-1-many: 2+ recursive calls, subdomain 3 (no fam -> fam)
    assert.deepStrictEqual(getTotalFamily([g2, g1]), 1);
    assert.deepStrictEqual(getTotalFamily([g4, g3]), 1);
    // 0-1-many: 2+ recursive calls, subdomain 4 (no fam -> no fam)
    assert.deepStrictEqual(getTotalFamily([g2, g4]), 0);
    assert.deepStrictEqual(getTotalFamily([g4, g2]), 0);
  });

  it("getHostGuests", function () {
    // 0-1-many: base case
    assert.deepStrictEqual(getHostGuests("Molly", []), []);
    assert.deepStrictEqual(getHostGuests("James", []), []);
    // 0-1-many: 1 recursive call, subdomain 1 (belongs)
    assert.deepStrictEqual(getHostGuests("Molly", [g1]), [g1]);
    assert.deepStrictEqual(getHostGuests("James", [g3]), [g3]);
    // 0-1-many: 1 recursive call, subdomain 2 (doesn't belong)
    assert.deepStrictEqual(getHostGuests("Molly", [g4]), []);
    assert.deepStrictEqual(getHostGuests("James", [g2]), []);
    // 0-1-many: 2+ recursive calls, subdomain 1 (1st belongs, 2nd belongs)
    assert.deepStrictEqual(getHostGuests("Molly", [g1, g2]), [g1, g2]);
    assert.deepStrictEqual(getHostGuests("James", [g3, g4]), [g3, g4]);
    // 0-1-many: 2+ recursive calls, subdomain 2 (1st belongs, 2nd doesn't belong)
    assert.deepStrictEqual(getHostGuests("Molly", [g1, g4]), [g1]);
    assert.deepStrictEqual(getHostGuests("James", [g3, g2]), [g3]);
    // 0-1-many: 2+ recursive calls, subdomain 1 (1st doesn't belong, 2nd belongs)
    assert.deepStrictEqual(getHostGuests("Molly", [g4, g1]), [g1]);
    assert.deepStrictEqual(getHostGuests("James", [g2, g3]), [g3]);
    // 0-1-many: 2+ recursive calls, subdomain 1 (1st doesn't belong, 2nd doesn't belong)
    assert.deepStrictEqual(getHostGuests("Molly", [g4, g3]), []);
    assert.deepStrictEqual(getHostGuests("James", [g2, g1]), []);
  });

  it("getGuestRange", function () {
    // if-else subdomain 1 (at least 2):
    assert.deepStrictEqual(getGuestRange([g0]), "1");
    assert.deepStrictEqual(getGuestRange([g1]), "2");
    assert.deepStrictEqual(getGuestRange([g3, g4]), "3");
    assert.deepStrictEqual(getGuestRange([g4, g4]), "4");
    assert.deepStrictEqual(getGuestRange([g4, g4, g4]), "6");
    // if-else subdomain 2:
    assert.deepStrictEqual(getGuestRange([g2]), "1-2");
    assert.deepStrictEqual(getGuestRange([g3, g4, g5]), "4-5");
  });

  it("getGuestMax", function () {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(getGuestMax([]), 0);
    // 0-1-many: 1 recursive call, subdomain 1
    assert.deepStrictEqual(getGuestMax([g1]), 2);
    assert.deepStrictEqual(getGuestMax([g2]), 2);
    // 0-1-many: 1 recursive call, subdomain 2
    assert.deepStrictEqual(getGuestMax([g0]), 1);
    assert.deepStrictEqual(getGuestMax([g3]), 1);
    // 0-1-many: 2+ recursive calls (s1 -> s1)
    assert.deepStrictEqual(getGuestMax([g1, g2]), 4);
    assert.deepStrictEqual(getGuestMax([g2, g2]), 4);
    // 0-1-many: 2+ recursive calls (s1 -> s2)
    assert.deepStrictEqual(getGuestMax([g1, g0]), 3);
    assert.deepStrictEqual(getGuestMax([g2, g0]), 3);
    // 0-1-many: 2+ recursive calls (s2 -> s1)
    assert.deepStrictEqual(getGuestMax([g0, g1]), 3);
    assert.deepStrictEqual(getGuestMax([g3, g4]), 3);
    // 0-1-many: 2+ recursive calls (s2 -> s2)
    assert.deepStrictEqual(getGuestMax([g0, g3]), 2);
    assert.deepStrictEqual(getGuestMax([g3, g3]), 2);
  });

  it("getGuestMin", function () {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(getGuestMin([]), 0);
    // 0-1-many: 1 recursive call, subdomain 1
    assert.deepStrictEqual(getGuestMin([g1]), 2);
    assert.deepStrictEqual(getGuestMin([g4]), 2);
    // 0-1-many: 1 recursive call, subdomain 2
    assert.deepStrictEqual(getGuestMin([g0]), 1);
    assert.deepStrictEqual(getGuestMin([g2]), 1);
    // 0-1-many: 2+ recursive calls (s1 -> s1)
    assert.deepStrictEqual(getGuestMin([g1, g4]), 4);
    assert.deepStrictEqual(getGuestMin([g4, g4]), 4);
    // 0-1-many: 2+ recursive calls (s1 -> s2)
    assert.deepStrictEqual(getGuestMin([g1, g0]), 3);
    assert.deepStrictEqual(getGuestMin([g4, g2]), 3);
    // 0-1-many: 2+ recursive calls (s2 -> s1)
    assert.deepStrictEqual(getGuestMin([g0, g1]), 3);
    assert.deepStrictEqual(getGuestMin([g2, g4]), 3);
    // 0-1-many: 2+ recursive calls (s2 -> s2)
    assert.deepStrictEqual(getGuestMin([g0, g2]), 2);
    assert.deepStrictEqual(getGuestMin([g3, g2]), 2);
  });

  it("parseGuest", function () {
    // subdomain 1: not a record
    assert.deepStrictEqual(parseGuest(""), undefined);
    assert.deepStrictEqual(parseGuest(5), undefined);
    // subdomain 2: no name field
    assert.deepStrictEqual(
      parseGuest({
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 3: no guestOf field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 4: no isFamily field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        restriction: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 5: no restriction field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        isFamily: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 6: no p1 field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1Name: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 7: no p1Name field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Restriction: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 8: no p1Restriction field
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Name: "",
      }),
      undefined
    );
    assert.deepStrictEqual(parseGuest({}), undefined);
    // subdomain 9: is a valid Guest
    assert.deepStrictEqual(
      parseGuest({
        name: "",
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      {
        name: "",
        guestOf: "",
        isFamily: "",
        restriction: "",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }
    );
    assert.deepStrictEqual(
      parseGuest({
        name: "joob",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }),
      {
        name: "joob",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      }
    );
  });
});
