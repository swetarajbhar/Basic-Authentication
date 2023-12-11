const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../your-express-app"); // Import your Express app
const { expect } = chai;

chai.use(chaiHttp);

describe("User Registration and Login API", () => {
  const validUser = {
    username: "testuser",
    password: "testpassword",
  };

  describe("POST /register", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(validUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("message")
            .that.includes("registered successfully");
          done();
        });
    });

    it("should return an error for incomplete registration data", (done) => {
      const incompleteUser = {
        username: "testuser",
      };

      chai
        .request(app)
        .post("/register")
        .send(incompleteUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").that.includes("password");
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", (done) => {
      chai
        .request(app)
        .post("/login")
        .send(validUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should return an error for incomplete login data", (done) => {
      const incompleteUser = {
        username: "testuser",
      };

      chai
        .request(app)
        .post("/login")
        .send(incompleteUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").that.includes("password");
          done();
        });
    });

    it("should return an error for invalid credentials", (done) => {
      const invalidUser = {
        username: "testuser",
        password: "wrongpassword",
      };

      chai
        .request(app)
        .post("/login")
        .send(invalidUser)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body)
            .to.have.property("error")
            .that.includes("Invalid credentials");
          done();
        });
    });
  });
});
