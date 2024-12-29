import { isRecord } from "./record";

// Description of an individual guest
export type Guest = {
  readonly name: string;
  readonly guestOf: string;
  readonly isFamily: string;
  readonly restriction: string;
  readonly p1: string;
  readonly p1Name: string;
  readonly p1Restriction: string;
};

/**
 * Given an array of guests of a specific host (James or Molly), returns the number of guests of
 * that particular host if they are family. It is up to the caller to make sure the guests are all of the same host.
 * @param guests the array of guests
 * @returns the number of family guests in the given array of guests.
 */
export const getTotalFamily = (guests: Guest[]): number => {
  if (guests.length === 0) {
    return 0;
  } else if (guests[0].isFamily !== "") {
    return 1 + getTotalFamily(guests.slice(1));
  } else {
    return 0 + getTotalFamily(guests.slice(1));
  }
};

/**
 * Given an array of guests and a host (James or Molly), returns an array of guests containing
 * only the guests belonging to that host.
 * @param guestOf the host in question
 * @param guests the array of guests
 * @returns an array of type Guest containing all the guests beloning to the host guestOf.
 */
export const getHostGuests = (guestOf: string, guests: Guest[]): Guest[] => {
  if (guests.length === 0) {
    return [];
  } else if (guests[0].guestOf === guestOf) {
    const arr = [guests[0]];
    return arr.concat(getHostGuests(guestOf, guests.slice(1)));
  } else {
    return getHostGuests(guestOf, guests.slice(1));
  }
};

/**
 * Given an array of guests of a specific host (James or Molly), returns a string representation of
 * the possible range of guests for the given host. It is up to the caller to make sure the guests are
 * all of the same host.
 * @param guests the array of guests
 * @returns a string representing the range of guests in the given array of guests.
 */
export const getGuestRange = (guests: Guest[]): string => {
  const min = getGuestMin(guests);
  const max = getGuestMax(guests);
  if (min === max) {
    return max.toString();
  } else {
    return min.toString() + "-" + max.toString();
  }
};

/**
 * the maximum possible number of guests of a specific host (James or Molly)
 * @param guests the array of guests
 * @returns a number representing the maximum possible number of guests for the host
 */
export const getGuestMax = (guests: Guest[]): number => {
  if (guests.length === 0) {
    return 0;
  } else if (guests[0].p1 === "1" || guests[0].p1 === "1?") {
    return 2 + getGuestMax(guests.slice(1));
  } else {
    return 1 + getGuestMax(guests.slice(1));
  }
};

/**
 * returns the minimum possible number of guests of a specific host (James or Molly)
 * @param guests the array of guests
 * @returns a number representing the minimum possible number of guests for the host
 */
export const getGuestMin = (guests: Guest[]): number => {
  if (guests.length === 0) {
    return 0;
  } else if (guests[0].p1 === "1") {
    return 2 + getGuestMin(guests.slice(1));
  } else {
    return 1 + getGuestMin(guests.slice(1));
  }
};

/**
 * Parses unknown data into a Guest. Will log an error and return undefined
 * if it is not a valid Auction.
 * @param val unknown data to parse into a Guest
 * @return Guest if val is a valid Guest and undefined otherwise
 */
export const parseGuest = (val: unknown): undefined | Guest => {
  if (!isRecord(val)) {
    console.error("not a Guest", val);
    return undefined;
  }

  if (typeof val.name !== "string") {
    console.error("not a guest: missing 'name'", val);
    return undefined;
  }

  if (typeof val.guestOf !== "string") {
    console.error("not a guest: missing 'guestOf'", val);
    return undefined;
  }

  if (typeof val.isFamily !== "string") {
    console.error("not a guest: missing 'isFamily'", val);
    return undefined;
  }

  if (typeof val.restriction !== "string") {
    console.error("not a guest: missing 'restriction'", val);
    return undefined;
  }

  if (typeof val.p1 !== "string") {
    console.error("not a guest: missing 'p1'", val);
    return undefined;
  }

  if (typeof val.p1Name !== "string") {
    console.error("not a guest: missing 'p1Name'", val);
    return undefined;
  }

  if (typeof val.p1Restriction !== "string") {
    console.error("not a guest: missing 'p1Restriction'", val);
    return undefined;
  }

  return {
    name: val.name,
    guestOf: val.guestOf,
    isFamily: val.isFamily,
    restriction: val.restriction,
    p1: val.p1,
    p1Name: val.p1Name,
    p1Restriction: val.p1Restriction,
  };
};
