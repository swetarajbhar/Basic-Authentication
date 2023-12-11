Certainly! Below is a basic `README.md` file that you can use for your Basic Authentication API:

````markdown
# Basic Authentication API

This is a simple RESTful API built with Node.js and Express.js that provides user registration, login, and access to protected resources using JSON Web Tokens (JWT). The user data is stored in-memory for simplicity.

## Requirements

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- [Any other dependencies or libraries you may use]

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/swetarajbhar/Basic-Authentication.git
   ```
````

2. Navigate to the project directory:

   ```bash
   cd Basic-Authentication
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables (if needed):

   Create a `.env` file in the root directory and add any necessary configuration variables.

   ```env
   PORT=8081
   JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
   JWT_ACCESS_TOKEN_EXPIRY=access_token_expiry
   JWT_REFRESH_TOKEN_SECRET=your_access_token_secret
   JWT_REFRESH_TOKEN_EXPIRY=refresh_token_expiry
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:8081` or the port specified in your `.env` file.

2. Use an API client (e.g., Postman or cURL) to interact with the following endpoints:

   - **User Registration:**

     - Endpoint: `POST /api/register`
     - Request Body: JSON object with `username` and `password` fields.

   - **User Login:**

     - Endpoint: `POST /api/login`
     - Request Body: JSON object with `username` and `password` fields.

   - **Protected Resource:**

     - Endpoint: `GET /api/protected`
     - Authentication: Include a valid JWT token in the request header (`Authorization: Bearer <token>`).

   - **List of Users:**
     - Endpoint: `GET /api/users`
     - Authentication: Include a valid JWT token in the request header (`Authorization: Bearer <token>`).

## Bonus Features

- **Token Refresh Functionality:**

  - Endpoint: `POST /api/refresh`
  - Request Body: JSON object with `refreshToken` field.

- **Error Handling:**

  - Proper error messages are returned for various scenarios.

- **Environment Variables:**

  - Configuration variables are stored in a `.env` file.

- **Unit Tests:**
  - Includes unit tests for registration, login, and other endpoints.

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request.
