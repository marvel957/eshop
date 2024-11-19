const request = require("supertest");
const app = require("../../app");
const { connectMongo, disconnectMongo } = require("../../services/mongo.js");

describe("Test products api", () => {
  beforeAll(async () => {
    await connectMongo();
  });
  afterAll(async () => {
    await disconnectMongo();
  });

  describe("Test GET /products", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });

  describe("Test post /products", () => {
    const completeLaunchData = {
      mission: "Uss- enterprise",
      rocket: "NCC 170",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const completeLaunchDataWithoutDate = {
      mission: "Uss- enterprise",
      rocket: "NCC 170",
      target: "Kepler-62 f",
    };
    const launchDataWithInvalidDate = {
      mission: "Uss- enterprise",
      rocket: "NCC 170",
      target: "Kepler-62 f",
      launchDate: "zoot",
    };
    test("it should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect(201)
        .expect("Content-Type", /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(completeLaunchDataWithoutDate);
    });
    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "incorrect data",
      });
    });
    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid date",
      });
    });
  });
});
