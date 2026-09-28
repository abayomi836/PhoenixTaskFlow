# Department Management API Documentation

## Overview

The Department Management API allows authorized users to view and manage organizational departments.

Departments can be created, updated, viewed, and deactivated through the API.

Only administrators can create, update, or deactivate departments.

---

## Department Model

Each department contains the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique department identifier |
| `name` | String | Yes | Department name |
| `description` | String | No | Description of the department |
| `isActive` | Boolean | Yes | Indicates whether the department is active |
| `createdAt` | Date | Automatic | Creation date |
| `updatedAt` | Date | Automatic | Last update date |

Department names must be unique.

---

## Authentication

All department endpoints require authentication.

The JWT must be sent using the Bearer authentication scheme:

```text
Authorization: Bearer JWT_TOKEN

Get All Departments

GET /api/departments

Returns a list of departments.

Access

Authenticated users.

Successful Response

{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": []
}

Get Department by ID

GET /api/departments/:id

Returns a specific department.

Access

Authenticated users.

Example

GET /api/departments/DEPARTMENT_ID

Successful Response

{
  "success": true,
  "message": "Department retrieved successfully",
  "data": {}
}


Create Department

POST /api/departments

Creates a new department.

Access

admin only.

Request Body

{
  "name": "Finance",
  "description": "Manages financial operations."
}


Validation

name is required.
name must not be empty.
description is optional.
Department names must be unique.

Successful Response

{
  "success": true,
  "message": "Department created successfully",
  "data": {}
}


Update Department

PATCH /api/departments/:id

Updates an existing department.

Access

admin only.

Request Body

{
  "name": "Finance and Accounts",
  "description": "Manages financial and accounting operations."
}


Only the fields that need to be changed should be included.

Successful Response

{
  "success": true,
  "message": "Department updated successfully",
  "data": {}
}


Deactivate Department

DELETE /api/departments/:id

Deactivates a department.

The department is not physically removed from the database. Its isActive field is changed to false.

Access

admin only.

Successful Response

{
  "success": true,
  "message": "Department deactivated successfully",
  "data": null
}


Authorization

Operation			Admin		Manager		Employee
View departments		Yes		Yes		Yes
Create department		Yes		No		No
Update department		Yes		No		No
Deactivate department		Yes		No		No

Authorization is enforced by the backend.

Error Handling

Authentication Required

Returned when a protected endpoint is accessed without a valid JWT.

{
  "success": false,
  "message": "Authentication required",
  "data": null
}


Unauthorized Action

Returned when an authenticated user does not have permission to perform the requested operation.

{
  "success": false,
  "message": "You are not authorized to perform this action",
  "data": null
}


Duplicate Department

Returned when an attempt is made to create a department with an existing name.

{
  "success": false,
  "message": "Department already exists",
  "data": null
}

Invalid ID

Returned when an invalid MongoDB ObjectId is supplied.

{
  "success": false,
  "message": "Invalid ID format",
  "data": null
}


HTTP Status Codes

Status Code	Meaning
200		Request completed successfully
201		Resource created successfully
400		Invalid request or validation error
401		Authentication required
403		User is not authorized
404		Resource not found
409		Resource already exists
500		Server error


Postman Testing

Recommended department API tests:

1. Login as an administrator.
2. Get all departments.
3. Get a department by ID.
4. Create a new department.
5. Update the department.
6. Deactivate the department.
7. Attempt to create a duplicate department.
8. Attempt to create a department as an employee.
9. Attempt to create a department as a manager.
10. Test the endpoints without authentication.

These tests verify both functionality and role-based authorization.