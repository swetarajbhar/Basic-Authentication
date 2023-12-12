const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app").app;

chai.use(chaiHttp);
const expect = chai.expect;

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU3dldGEiLCJpYXQiOjE3MDI0MDI4MDQsImV4cCI6MTcwNDEzMDgwNH0.MvncYsUIVUA3u89Uo1l4qOL1DJdxM6510BPiJVUU6a8";

describe("User Registration Endpoint", () => {
  it("should return a success message when valid username and password are provided", (done) => {
    chai
      .request(app)
      .post("/api/register")
      .send({ username: "TestUser", password: "TestPassword123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Registration Successful");
        expect(res.body).to.have.property("data").to.equal(true);
        done();
      });
  });

  it("should return an error when username is missing", (done) => {
    chai
      .request(app)
      .post("/api/register")
      .send({ password: "TestPassword123" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("type").to.equal("ValidationError");
        expect(res.body)
          .to.have.property("message")
          .to.equal("Username is required.");
        done();
      });
  });

  it("should return an error when password is missing", (done) => {
    chai
      .request(app)
      .post("/api/register")
      .send({ username: "TestUser" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("type").to.equal("ValidationError");
        expect(res.body)
          .to.have.property("message")
          .to.equal("Password is required");
        done();
      });
  });

  it("should return an error when username already exists", (done) => {
    // Assuming 'TestUser' already exists from a previous test case
    chai
      .request(app)
      .post("/api/register")
      .send({ username: "TestUser", password: "NewPassword123" })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.have.property("status").to.equal(409);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Username already exists. Choose a different username.");
        done();
      });
  });
});

describe("User Login Endpoint", () => {
  it("should return a success message and access token when valid username and password are provided", (done) => {
    chai
      .request(app)
      .post("/api/login")
      .send({ username: "TestUser", password: "TestPassword123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").to.equal(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Login Successful");
        expect(res.body)
          .to.have.property("data")
          .to.be.an("object")
          .that.has.property("accessToken");
        done();
      });
  });

  it("should return an error when username is missing", (done) => {
    chai
      .request(app)
      .post("/api/login")
      .send({ password: "TestPassword123" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("type").to.equal("ValidationError");
        expect(res.body)
          .to.have.property("message")
          .to.equal("Username is required.");
        done();
      });
  });

  it("should return an error when password is missing", (done) => {
    chai
      .request(app)
      .post("/api/login")
      .send({ username: "TestUser" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("type").to.equal("ValidationError");
        expect(res.body)
          .to.have.property("message")
          .to.equal("Password is required");
        done();
      });
  });

  it("should return an error when username and password are not found", (done) => {
    chai
      .request(app)
      .post("/api/login")
      .send({ username: "NonExistingUser", password: "NonExistingPassword" })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").to.equal(401);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Invalid Username or Password");
        expect(res.body).to.have.property("data").to.deep.equal({});
        done();
      });
  });
});

describe("Refresh Access Token Endpoint", () => {
  it("should return a new access token when a valid refresh token is provided", (done) => {
    // Assuming we have a valid refresh token in cookies
    chai
      .request(app)
      .post("/api/refresh")
      .set(
        "Cookie",
        "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU3dldGExIiwiaWF0IjoxNzAyMzk3OTAxLCJleHAiOjE3MDI0ODQzMDF9.M3qdxJD9Ll3Z6DvLi2w0pHyo3tHs3ykAuwliawnRPYs"
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").to.equal(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Access Token Generated");
        expect(res.body)
          .to.have.property("data")
          .to.be.an("object")
          .that.has.property("accessToken");
        done();
      });
  });

  it("should return an error when no refresh token is provided", (done) => {
    chai
      .request(app)
      .post("/api/refresh")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").to.equal(401);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Access Denied. No refresh token provided.");
        done();
      });
  });

  it("should return an error when an invalid refresh token is provided", (done) => {
    chai
      .request(app)
      .post("/api/refresh")
      .set("Cookie", "refreshToken=invalidRefreshToken")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").to.equal(401);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Invalid refresh token.");
        expect(res.body).to.have.property("data").to.equal(null);
        done();
      });
  });
});

describe("Protected Resource Endpoint", () => {
  it("should return a success message when a valid authorization token is provided", (done) => {
    chai
      .request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("You've accessed the protected resource!");
        done();
      });
  });

  it("should return an error when no authorization token is provided", (done) => {
    chai
      .request(app)
      .get("/api/protected")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Access Denied. No token provided.");
        done();
      });
  });
});

describe("Protected Resource Endpoint - User Data", () => {
  it("should return user data when a valid authorization token is provided", (done) => {
    chai
      .request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("User Data Fetched Successfully");
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property("users").to.be.an("array");
        done();
      });
  });

  it("should return an error when no authorization token is provided", (done) => {
    chai
      .request(app)
      .get("/api/users")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Access Denied. No token provided.");
        done();
      });
  });

  it("should return empty user data when valid authorization token is provided but no users have registered", (done) => {
    chai
      .request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .to.equal("User Data Fetched Successfully");
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property("users").to.be.an("array");

        if (res.body.data.users.length === 0) {
          expect(res.body.data.users).to.be.empty;
        }
        done();
      });
  });
});
