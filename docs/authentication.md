# Authentication API Documentation

## Overview

PhoenixTASKFLOW uses JWT (JSON Web Token) authentication to secure protected API endpoints.

Passwords are hashed using `bcryptjs` before they are stored in MongoDB. Passwords are never returned in API responses.

Authentication flow:

1. A user registers or logs in.
2. The backend verifies the user's credentials.
3. The backend generates a JWT.
4. The client sends the token with protected requests.
5. The authentication middleware verifies the token and identifies the user.

---

## Authentication Endpoints

### Register

**POST** `/api/auth/register`

Creates a new employee account.

New users are assigned the `employee` role by default.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "position": "Teacher",
  "department": "DEPARTMENT_ID"
}

Validation

name is required.
email must be a valid email address.
password must contain at least 8 characters.
position is required.
department is required.
Email addresses must be unique.

Successful Response

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "position": "Teacher",
      "department": "DEPARTMENT_ID",
      "isActive": true
    },
    "token": "JWT_TOKEN"
  }
}


The password is not included in the response.

Login

POST /api/auth/login

Authenticates an existing user and returns a JWT.

Request Body

{
  "email": "john@example.com",
  "password": "password123"
}

Successful Response

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "position": "Teacher",
      "department": "DEPARTMENT_ID",
      "isActive": true
    },
    "token": "JWT_TOKEN"
  }
}

The password is not included in the response.

Get Current User

GET /api/auth/me

Returns the details of the currently authenticated user.

Authentication

This endpoint requires a valid JWT.

The token must be sent using the Bearer authentication scheme:

Authorization: Bearer JWT_TOKEN

Successful Response

{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "position": "Teacher",
    "department": "DEPARTMENT_ID",
    "isActive": true
  }
}


JWT Authentication

PhoenixTASKFLOW uses JSON Web Tokens for authentication.

After successful registration or login, the backend generates a token containing the authenticated user's ID.

The token is valid for 7 days.

Protected requests must include the token in the request header:

Authorization: Bearer JWT_TOKEN


The authentication middleware:

Checks whether an Authorization header exists.
Extracts the Bearer token.
Verifies the JWT.
Finds the corresponding user.
Excludes the user's password from the retrieved user data.
Checks whether the user is active.
Attaches the authenticated user to req.user.

Password Security

Passwords are hashed using bcryptjs before being stored in MongoDB.

The application does not store users' passwords as plain text.

Passwords are also excluded from user queries and API responses where authentication-related user data is returned.

Authentication Middleware

Protected routes use the authentication middleware:

protect

The middleware ensures that only authenticated users can access protected resources.

If authentication succeeds, the authenticated user's information is made available through:

req.user

Other middleware and controllers can use req.user.role, req.user._id, and other user properties to enforce application permissions.

Authentication Errors

Missing Token

If a protected endpoint is accessed without authentication:

{
  "success": false,
  "message": "Authentication required",
  "data": null
}


Invalid or Expired Token

An invalid or expired JWT results in an authentication error.

User Not Found

If the JWT refers to a user who no longer exists, the request is rejected.

Inactive User

Inactive users cannot access protected resources.


Authentication and Authorization

Authentication determines who the user is.

Authorization determines what the authenticated user is allowed to do.

PhoenixTASKFLOW has three roles:

Role		General Access
admin		Organization-wide management
manager		Department-level management
employee	Personal tasks and profile

Role-based authorization is handled separately from JWT authentication.

Authentication Flow

User
  ↓
Register / Login
  ↓
Backend validates credentials
  ↓
Password verification / hashing
  ↓
JWT generated
  ↓
Client stores token
  ↓
Client sends Bearer token
  ↓
Authentication middleware
  ↓
JWT verified
  ↓
User identified
  ↓
Protected controller
  ↓
Response


Testing Authentication

Authentication endpoints can be tested using Postman.

Recommended test sequence:

Register a user.
Login with the registered credentials.
Copy the returned JWT.
Send the token as a Bearer token.
Test GET /api/auth/me.
Test protected endpoints with and without the token.
Test invalid credentials.
Test invalid or expired tokens.


Authentication Endpoints Summary

Method		Endpoint			Authentication
POST		/api/auth/register		Public
POST		/api/auth/login			Public
GET		/api/auth/me			Required