# User Management API Documentation

## Overview

The User Management API allows authorized users to view, create, update, and deactivate user accounts.

PhoenixTASKFLOW supports three user roles:

- `admin`
- `manager`
- `employee`

User management permissions depend on the authenticated user's role and department.

---

## User Model

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique user identifier |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Hashed password |
| `role` | String | Yes | `admin`, `manager`, or `employee` |
| `position` | String | Yes | User's organizational position |
| `department` | ObjectId | Yes | Reference to the user's department |
| `isActive` | Boolean | Yes | Account status |
| `createdAt` | Date | Automatic | Creation date |
| `updatedAt` | Date | Automatic | Last update date |

Passwords are excluded from API responses.

---

## Authentication

All user management endpoints require authentication.

The JWT must be sent using:

```text
Authorization: Bearer JWT_TOKEN

Get Users

GET /api/users

Returns a paginated list of users.

Access

admin can view users across the organization.
manager can view users within their department.
employee cannot access the user list.

Query Parameters

| Parameter | Description              | Default |
| --------- | ------------------------ | ------- |
| `page`    | Page number              | `1`     |
| `limit`   | Number of users per page | `10`    |


The maximum page size is 100.

Example

GET /api/users?page=1&limit=10

Successful Response

{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}


Get User by ID

GET /api/users/:id

Returns a specific user.

Access

admin can view any user.
manager can view users within their department.
employee can view only their own profile.

Example

GET /api/users/USER_ID

Successful Response

{
  "success": true,
  "message": "User retrieved successfully",
  "data": {}
}

The user's password is never returned.

Create User

POST /api/users

Creates a new user account.

Access

admin only.

Request Body

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "employee",
  "position": "Accountant",
  "department": "DEPARTMENT_ID"
}


Validation

name is required.
email must be valid.
password must contain at least 8 characters.
role must be admin, manager, or employee.
position is required.
department is required.
Email addresses must be unique.
The department must exist and be active.

Successful Response

{
  "success": true,
  "message": "User created successfully",
  "data": {}
}

The password is not included in the response.

Update User

PATCH /api/users/:id

Updates an existing user's information.

Access

Permissions depend on the authenticated user's role.

admin can update users across the organization.
manager can update users within their department, subject to role restrictions.
employee can update only their own name and position.

Request Body

Example:

{
  "name": "Jane Updated",
  "position": "Senior Accountant"
}

{
  "name": "Jane Updated",
  "position": "Senior Accountant"
}

Other supported update fields include:

{
  "email": "jane.updated@example.com",
  "role": "employee",
  "department": "DEPARTMENT_ID",
  "isActive": true
}

Successful Response

{
  "success": true,
  "message": "User updated successfully",
  "data": {}
}

The password is not returned.

Deactivate User

DELETE /api/users/:id

Deactivates a user account.

The user is not physically deleted from the database. Instead, the isActive field is changed to false.

Access

admin can deactivate users across the organization.
manager can deactivate users within their department.
employee cannot deactivate users.

Successful Response

{
  "success": true,
  "message": "User deactivated successfully",
  "data": null
}


Role-Based Access

| Operation       | Admin |         Manager |            Employee |
| --------------- | ----: | --------------: | ------------------: |
| View all users  |   Yes | Department only |                  No |
| View user by ID |   Yes |  Own department |           Self only |
| Create user     |   Yes |              No |                  No |
| Update user     |   Yes |  Own department | Self: name/position |
| Deactivate user |   Yes |  Own department |                  No |


Manager Restrictions

Managers have department-level authority.

A manager:

can manage users within their own department;
cannot manage users from another department;
cannot assign the admin role;
cannot change a user's department;
cannot create users through the user-management endpoint.

Employee Restrictions

Employees have limited access to user management.

An employee can:

view their own profile;
update their own name;
update their own position.

An employee cannot:

view the complete user list;
view another user's profile;
create users;
change their role;
change their department;
deactivate users.

Error Handling

Authentication Required

{
  "success": false,
  "message": "Authentication required",
  "data": null
}


Unauthorized Action

{
  "success": false,
  "message": "You are not authorized to perform this action",
  "data": null
}

User Not Found

{
  "success": false,
  "message": "User not found",
  "data": null
}

Duplicate Email

{
  "success": false,
  "message": "Email already exists",
  "data": null
}

Invalid ID

{
  "success": false,
  "message": "Invalid ID format",
  "data": null
}

HTTP Status Codes

| Status Code | Meaning                             |
| ----------- | ----------------------------------- |
| `200`       | Request completed successfully      |
| `201`       | User created successfully           |
| `400`       | Invalid request or validation error |
| `401`       | Authentication required             |
| `403`       | User is not authorized              |
| `404`       | User not found                      |
| `409`       | Email already exists                |
| `500`       | Server error                        |


User Management Endpoints

| Method | Endpoint         | Purpose           |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | Get users         |
| GET    | `/api/users/:id` | Get a user        |
| POST   | `/api/users`     | Create a user     |
| PATCH  | `/api/users/:id` | Update a user     |
| DELETE | `/api/users/:id` | Deactivate a user |


Testing with Postman

Recommended tests:

1. Login as an administrator.
2. Get the list of users.
3. Get a user by ID.
4. Create a new user.
5. Update a user.
6. Deactivate a user.
7. Test duplicate email validation.
8. Test invalid user data.
9. Test employee restrictions.
10. Test manager department restrictions.
11. Test requests without authentication.
12. Test an invalid user ID.