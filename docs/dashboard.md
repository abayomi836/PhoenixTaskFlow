# Dashboard Statistics API Documentation

## Overview

The Dashboard Statistics API provides task and user statistics based on the authenticated user's role.

The information returned by the endpoint is automatically scoped according to the user's access level.

---

## Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Returns dashboard statistics for the authenticated user.

### Authentication

This endpoint requires a valid JWT.

```text
Authorization: Bearer JWT_TOKEN

Admin Dashboard

Administrators receive organization-wide task statistics.

The response includes:

Total tasks
Pending tasks
In-progress tasks
Completed tasks
Overdue tasks
Total active employees
Total active departments

Example Response

{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalTasks": 2,
    "pending": 1,
    "inProgress": 1,
    "completed": 0,
    "overdue": 0,
    "totalEmployees": 3,
    "totalDepartments": 2
  }
}

The employee count includes active users whose role is employee.

The department count includes active departments.

Manager Dashboard

Managers receive statistics for their own department.

The response includes:

Total tasks in the department
Pending tasks
In-progress tasks
Completed tasks
Overdue tasks
Total active employees in the department

Example Response

{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalTasks": 2,
    "pending": 1,
    "inProgress": 1,
    "completed": 0,
    "overdue": 0,
    "totalEmployees": 2
  }
}

Managers cannot use this endpoint to retrieve organization-wide task statistics.

Employee Dashboard

Employees receive statistics for tasks assigned to them.

The response includes:

Total assigned tasks
Pending tasks
In-progress tasks
Completed tasks
Overdue tasks

Example Response

{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalTasks": 1,
    "pending": 0,
    "inProgress": 1,
    "completed": 0,
    "overdue": 0
  }
}

Employees cannot retrieve statistics for other users.

Task Statistics

Total Tasks

The totalTasks value represents the number of tasks within the authenticated user's permitted scope.

Pending

The pending value represents tasks whose status is:

pending


In Progress

The inProgress value represents tasks whose status is:

in-progress


Completed

The completed value represents tasks whose status is:

completed


Overdue

A task is counted as overdue when:

dueDate < current time

AND

status != completed

dueDate < current time

AND

status != completed

Completed tasks are not counted as overdue even if their due date has passed.

Role-Based Data Scope

| Role     | Task Statistics    | Employee Count                 | Department Count   |
| -------- | ------------------ | ------------------------------ | ------------------ |
| Admin    | Organization-wide  | Active employees               | Active departments |
| Manager  | Own department     | Active employees in department | Not included       |
| Employee | Own assigned tasks | Not included                   | Not included       |


The backend determines the scope from the authenticated user's role and department.

ecurity

The endpoint is protected by the authentication middleware.

An unauthenticated request is rejected.

Unauthenticated Response

{
  "success": false,
  "message": "Authentication required",
  "data": null
}


The API does not accept a user ID from the client to determine whose statistics should be returned. The authenticated user's identity comes from the verified JWT.

HTTP Status Codes

| Status Code | Meaning                           |
| ----------- | --------------------------------- |
| `200`       | Statistics retrieved successfully |
| `401`       | Authentication required           |
| `500`       | Server error                      |


Endpoint Summary

| Method | Endpoint               | Purpose                                  |
| ------ | ---------------------- | ---------------------------------------- |
| GET    | `/api/dashboard/stats` | Retrieve role-based dashboard statistics |


Postman Testing

Recommended tests:

Login as an administrator.
Send GET /api/dashboard/stats.
Verify organization-wide task statistics.
Verify active employee count.
Verify active department count.
Login as a manager.
Send the same request.
Verify that only the manager's department statistics are returned.
Login as an employee.
Verify that only the employee's assigned task statistics are returned.
Send the request without authentication.
Verify that the API returns 401.