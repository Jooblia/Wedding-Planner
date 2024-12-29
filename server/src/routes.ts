import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response; // only writing, so no need to check

// Description of an individual guest
type Guest = {
  name: string;
  guestOf: string;
  isFamily: string;
  restriction: string;
  p1: string;
  p1Name: string;
  p1Restriction: string;
};

// Map from name to guest details.
const guests: Map<string, Guest> = new Map();

/** Testing function to remove all the added guests. */
export const resetForTesting = (): void => {
  guests.clear();
};

/**
 * Returns a list of all the auctions.
 * @param _req the request
 * @param res the response
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({ guests: vals });
};

/**
 * Add the guest to the list.
 * @param req the request
 * @param res the response
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== "string") {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guestOf = req.body.guestOf;
  if (typeof guestOf !== "string") {
    res.status(400).send("missing 'guestOf' parameter");
    return;
  }

  const isFamily = req.body.isFamily;
  if (typeof isFamily !== "string") {
    res.status(400).send("missing 'isFamily' parameter");
    return;
  }

  const restriction = req.body.restriction;
  if (typeof restriction !== "string") {
    res.status(400).send("missing 'restriction' parameter");
    return;
  }

  const p1 = req.body.p1;
  if (typeof p1 !== "string") {
    res.status(400).send("missing 'p1' parameter");
    return;
  }

  const p1Name = req.body.p1Name;
  if (typeof p1Name !== "string") {
    res.status(400).send("missing 'p1Name' parameter");
    return;
  }

  const p1Restriction = req.body.p1Restriction;
  if (typeof p1Restriction !== "string") {
    res.status(400).send("missing 'p1Restriction' parameter");
    return;
  }

  const guest: Guest = {
    name: name,
    guestOf: guestOf,
    isFamily: isFamily,
    restriction: restriction,
    p1: p1,
    p1Name: p1Name,
    p1Restriction: p1Restriction,
  };

  guests.set(guest.name, guest);
  res.send({ guest: guest });
};

/**
 * Saves the details entered for a given guest
 * @param req the request
 * @param res the response
 */
export const saveGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== "string") {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guestOf = req.body.guestOf;
  if (typeof guestOf !== "string") {
    res.status(400).send("missing 'guestOf' parameter");
    return;
  }

  const isFamily = req.body.isFamily;
  if (typeof isFamily !== "string") {
    res.status(400).send("missing 'isFamily' parameter");
    return;
  }

  const restriction = req.body.restriction;
  if (typeof restriction !== "string") {
    res.status(400).send("missing 'restriction' parameter");
    return;
  }

  const p1 = req.body.p1;
  if (typeof p1 !== "string") {
    res.status(400).send("missing 'p1' parameter");
    return;
  }

  const p1Name = req.body.p1Name;
  if (typeof p1Name !== "string") {
    res.status(400).send("missing 'p1Name' parameter");
    return;
  }

  const p1Restriction = req.body.p1Restriction;
  if (typeof p1Restriction !== "string") {
    res.status(400).send("missing 'p1Restriction' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name ${name}`);
    return;
  }

  guest.restriction = restriction;
  guest.p1 = p1;
  guest.p1Name = p1Name;
  guest.p1Restriction = p1Restriction;
  res.send({ guest: guest });
};

/**
 * Retrives the details of a given guest.
 * @param req the request
 * @param res the response
 */
export const getGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({ guest: guest });
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === "string") {
    return param;
  } else {
    return undefined;
  }
};
