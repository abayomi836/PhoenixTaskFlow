# Authentication

## 1. Overview

PhoenixTASKFLOW uses JWT-based authentication to protect private API resources.

Authentication consists of:

- User registration
- User login
- Password hashing with bcryptjs
- JWT token generation
- JWT authentication middleware
- Current authenticated user retrieval

Passwords are hashed before being stored in MongoDB and are never returned in API responses.

---

## 2. User Registration

**Endpoint:**

`POST /api/auth/register`

A new user provides:

- name
- email
- password
- position
- department

New users are registered with the `employee` role by default.

The backend validates the submitted data, checks whether the email already exists, hashes the password, creates the user, and returns a JWT token.

### Example Request

```json
{
  "name": "Test Employee",
  "email": "testemployee@example.com",
  "password": "Password123",
  "position": "Teacher",
  "department": "DEPARTMENT_ID"
}

Successful Response

HTTP 201 Created

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Test Employee",
      "email": "testemployee@example.com",
      "role": "employee",
      "position": "Teacher",
      "department": "DEPARTMENT_ID",
      "isActive": true,
      "createdAt": "DATE",
      "updatedAt": "DATE"
    },
    "token": "JWT_TOKEN"
  }
}

Password Hashing

Passwords are hashed using bcryptjs before being stored in the database.

The original password is never stored as plain text.

During login, the submitted password is compared with the stored hash using bcrypt.

4. User Login

Endpoint:

POST /api/auth/login

A registered user provides their email and password.

The backend:

Validates the request.
Finds the user by email.
Compares the password with the stored bcrypt hash.
Checks that the account is active.
Generates a JWT token.
Returns the authenticated user's information and token.
Example Request

{
  "email": "testemployee@example.com",
  "password": "Password123"
}

Successful Response

HTTP 200 OK

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Test Employee",
      "email": "testemployee@example.com",
      "role": "employee",
      "position": "Teacher",
      "department": "DEPARTMENT_ID",
      "isActive": true
    },
    "token": "JWT_TOKEN"
  }
}

5. JWT Authentication

After successful registration or login, the backend generates a JSON Web Token (JWT).

The token contains the authenticated user's ID and expires after 7 days.

Protected requests must include the token using the Bearer authentication format:

Authorization: Bearer JWT_TOKEN

6. Authentication Middleware

Protected routes use the authentication middleware.

The middleware:

Checks for an Authorization header.
Verifies that it uses the Bearer format.
Extracts the JWT.
Verifies the token using the server's JWT secret.
Finds the corresponding user.
Excludes the password from the retrieved user.
Checks that the account is active.
Stores the authenticated user in req.user.

Routes can then use req.user to identify the currently authenticated user.

7. Current User

Endpoint:

GET /api/auth/me

This protected endpoint returns information about the currently authenticated user.

A valid JWT must be supplied in the request.

Successful Response

HTTP 200 OK

{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "Test Employee",
      "email": "testemployee@example.com",
      "role": "employee",
      "position": "Teacher",
      "department": "DEPARTMENT_ID",
      "isActive": true
    }
  }
}

The password is excluded from the response.

. Authentication Errors
Missing Token

HTTP 401 Unauthorized

{
  "success": false,
  "message": "Authentication required",
  "data": null
}
Invalid or Expired Token

HTTP 401 Unauthorized

{
  "success": false,
  "message": "Invalid or expired token",
  "data": null
}
Inactive Account

HTTP 403 Forbidden

{
  "success": false,
  "message": "This account is inactive",
  "data": null
}

Invalid Login Credentials

HTTP 401 Unauthorized

{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}

9. Authentication Testing

The authentication flow was tested using Postman.

Registration Test

Endpoint:

POST /api/auth/register

Result: 201 Created

The test user was successfully created and a JWT token was returned.

Login Test

Endpoint:

POST /api/auth/login

Result: 200 OK

The test user's credentials were accepted and a JWT token was returned.

Current User Test

Endpoint:

GET /api/auth/me

Result: 200 OK

The authenticated user's details were successfully returned using the JWT Bearer token.

The response did not expose the user's password.

10. Authentication Flow

User
  ↓
Register / Login
  ↓
Express Route
  ↓
Validation
  ↓
Authentication Controller
  ↓
bcrypt Password Verification
  ↓
JWT Generation
  ↓
JWT Token Returned
  ↓
Protected Request
  ↓
Authentication Middleware
  ↓
JWT Verification
  ↓
User Retrieved
  ↓
req.user
  ↓
Protected Controller

