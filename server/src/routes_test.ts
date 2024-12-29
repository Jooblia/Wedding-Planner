import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import {
  addGuest,
  getGuest,
  listGuests,
  resetForTesting,
  saveGuest,
} from "./routes";

describe("routes", function () {
  it("add", function () {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {},
    });
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

    // 2. Missing guestOf
    const req2 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: { name: "julia" },
    });
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'guestOf' parameter");

    // 3. Missing isFamily
    const req3 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: { name: "julia", guestOf: "James" },
    });
    const res3 = httpMocks.createResponse();
    addGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing 'isFamily' parameter");

    // 4. Missing restriction
    const req4 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: { name: "julia", guestOf: "James", isFamily: "" },
    });
    const res4 = httpMocks.createResponse();
    addGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "missing 'restriction' parameter");

    // 5. Missing p1
    const req5 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
      },
    });
    const res5 = httpMocks.createResponse();
    addGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "missing 'p1' parameter");

    // 6. Missing p1Name
    const req6 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
      },
    });
    const res6 = httpMocks.createResponse();
    addGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "missing 'p1Name' parameter");

    // 7. Missing p1Restriction
    const req7 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
      },
    });
    const res7 = httpMocks.createResponse();
    addGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(
      res7._getData(),
      "missing 'p1Restriction' parameter"
    );

    // 8. Correctly added
    const req8 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      },
    });
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData().guest.name, "julia");
    assert.deepStrictEqual(res8._getData().guest.guestOf, "James");
    assert.deepStrictEqual(res8._getData().guest.isFamily, "");
    assert.deepStrictEqual(res8._getData().guest.restriction, "none");
    assert.deepStrictEqual(res8._getData().guest.p1, "");
    assert.deepStrictEqual(res8._getData().guest.p1Name, "");
    assert.deepStrictEqual(res8._getData().guest.p1Restriction, "");

    const req9 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "bobby",
        guestOf: "Molly",
        isFamily: ", family",
        restriction: "none",
        p1: "1",
        p1Name: "jelly",
        p1Restriction: "none",
      },
    });
    const res9 = httpMocks.createResponse();
    addGuest(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData().guest.name, "bobby");
    assert.deepStrictEqual(res9._getData().guest.guestOf, "Molly");
    assert.deepStrictEqual(res9._getData().guest.isFamily, ", family");
    assert.deepStrictEqual(res9._getData().guest.restriction, "none");
    assert.deepStrictEqual(res9._getData().guest.p1, "1");
    assert.deepStrictEqual(res9._getData().guest.p1Name, "jelly");
    assert.deepStrictEqual(res9._getData().guest.p1Restriction, "none");
  });

  it("save", function () {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {},
    });
    const res1 = httpMocks.createResponse();
    saveGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

    // 2. Missing guestOf
    const req2 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: { name: "julia" },
    });
    const res2 = httpMocks.createResponse();
    saveGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'guestOf' parameter");

    // 3. Missing isFamily
    const req3 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: { name: "julia", guestOf: "James" },
    });
    const res3 = httpMocks.createResponse();
    saveGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing 'isFamily' parameter");

    // 4. Missing restriction
    const req4 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: { name: "julia", guestOf: "James", isFamily: "" },
    });
    const res4 = httpMocks.createResponse();
    saveGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "missing 'restriction' parameter");

    // 5. Missing p1
    const req5 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
      },
    });
    const res5 = httpMocks.createResponse();
    saveGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "missing 'p1' parameter");

    // 6. Missing p1Name
    const req6 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
      },
    });
    const res6 = httpMocks.createResponse();
    saveGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "missing 'p1Name' parameter");

    // 7. Missing p1Restriction
    const req7 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
      },
    });
    const res7 = httpMocks.createResponse();
    saveGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(
      res7._getData(),
      "missing 'p1Restriction' parameter"
    );

    // 8. Correctly saved
    const req8 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      },
    });
    const res8 = httpMocks.createResponse();
    saveGuest(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData().guest.name, "julia");
    assert.deepStrictEqual(res8._getData().guest.guestOf, "James");
    assert.deepStrictEqual(res8._getData().guest.isFamily, "");
    assert.deepStrictEqual(res8._getData().guest.restriction, "none");
    assert.deepStrictEqual(res8._getData().guest.p1, "");
    assert.deepStrictEqual(res8._getData().guest.p1Name, "");
    assert.deepStrictEqual(res8._getData().guest.p1Restriction, "");

    const req9 = httpMocks.createRequest({
      method: "POST",
      url: "/api/save",
      body: {
        name: "bobby",
        guestOf: "Molly",
        isFamily: ", family",
        restriction: "none",
        p1: "1",
        p1Name: "jelly",
        p1Restriction: "none",
      },
    });
    const res9 = httpMocks.createResponse();
    saveGuest(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData().guest.name, "bobby");
    assert.deepStrictEqual(res9._getData().guest.guestOf, "Molly");
    assert.deepStrictEqual(res9._getData().guest.isFamily, ", family");
    assert.deepStrictEqual(res9._getData().guest.restriction, "none");
    assert.deepStrictEqual(res9._getData().guest.p1, "1");
    assert.deepStrictEqual(res9._getData().guest.p1Name, "jelly");
    assert.deepStrictEqual(res9._getData().guest.p1Restriction, "none");
  });

  it("get", function () {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest({
      method: "GET",
      url: "/api/get",
      query: {},
    });
    const res1 = httpMocks.createResponse();
    getGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

    // 2. Invalid name
    const req2 = httpMocks.createRequest({
      method: "GET",
      url: "/api/get",
      query: { name: "barry" },
    });
    const res2 = httpMocks.createResponse();
    getGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "no guest with name 'barry'");

    // 3. Guest found
    const req3 = httpMocks.createRequest({
      method: "GET",
      url: "/api/get",
      query: { name: "julia" },
    });
    const res3 = httpMocks.createResponse();
    getGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData().guest.name, "julia");
    assert.deepStrictEqual(res3._getData().guest.guestOf, "James");
    assert.deepStrictEqual(res3._getData().guest.isFamily, "");
    assert.deepStrictEqual(res3._getData().guest.restriction, "none");
    assert.deepStrictEqual(res3._getData().guest.p1, "");
    assert.deepStrictEqual(res3._getData().guest.p1Name, "");
    assert.deepStrictEqual(res3._getData().guest.p1Restriction, "");

    const req4 = httpMocks.createRequest({
      method: "GET",
      url: "/api/get",
      query: { name: "bobby" },
    });
    const res4 = httpMocks.createResponse();
    getGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().guest.name, "bobby");
    assert.deepStrictEqual(res4._getData().guest.guestOf, "Molly");
    assert.deepStrictEqual(res4._getData().guest.isFamily, ", family");
    assert.deepStrictEqual(res4._getData().guest.restriction, "none");
    assert.deepStrictEqual(res4._getData().guest.p1, "1");
    assert.deepStrictEqual(res4._getData().guest.p1Name, "jelly");
    assert.deepStrictEqual(res4._getData().guest.p1Restriction, "none");
    resetForTesting();
  });

  it("list", function () {
    const req1 = httpMocks.createRequest({
      method: "GET",
      url: "/api/list",
      query: {},
    });
    const res1 = httpMocks.createResponse();
    listGuests(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), { guests: [] });

    const req8 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      body: {
        name: "julia",
        guestOf: "James",
        isFamily: "",
        restriction: "none",
        p1: "",
        p1Name: "",
        p1Restriction: "",
      },
    });
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);

    const req2 = httpMocks.createRequest({
      method: "GET",
      url: "/api/list",
      query: {},
    });
    const res2 = httpMocks.createResponse();
    listGuests(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {
      guests: [
        {
          name: "julia",
          guestOf: "James",
          isFamily: "",
          restriction: "none",
          p1: "",
          p1Name: "",
          p1Restriction: "",
        },
      ],
    });
  });
});
