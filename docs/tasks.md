# Task Management API Documentation

## Overview

The Task Management API allows authorized users to create, view, update, and delete tasks.

Tasks are assigned to employees and are associated with a department.

Task access and management depend on the authenticated user's role and department.

---

## Task Model

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique task identifier |
| `title` | String | Yes | Task title |
| `description` | String | No | Task description |
| `assignedTo` | ObjectId | Yes | Employee responsible for the task |
| `assignedBy` | ObjectId | Yes | User who assigned the task |
| `department` | ObjectId | Yes | Department responsible for the task |
| `priority` | String | Yes | `low`, `medium`, or `high` |
| `status` | String | Yes | `pending`, `in-progress`, or `completed` |
| `dueDate` | Date | Yes | Task deadline |
| `completedAt` | Date | No | Completion date |
| `createdAt` | Date | Automatic | Creation date |
| `updatedAt` | Date | Automatic | Last update date |

---

## Authentication

All task endpoints require authentication.

The JWT must be sent using:

```text
Authorization: Bearer JWT_TOKEN

Get Tasks

GET /api/tasks

Returns tasks available to the authenticated user.

Access Rules

admin can view organization-wide tasks.
manager can view tasks belonging to their department.
employee can view only tasks assigned to them.

Query Parameters

| Parameter    | Description                      |
| ------------ | -------------------------------- |
| `status`     | Filter by task status            |
| `priority`   | Filter by priority               |
| `department` | Filter by department             |
| `assignedTo` | Filter by assigned employee      |
| `search`     | Search task title or description |
| `page`       | Page number                      |
| `limit`      | Number of results per page       |


Example

GET /api/tasks?status=pending&page=1&limit=10

Successful Response

{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}

Tasks include information about the assigned user, assigning user, and department.

Get Task by ID

GET /api/tasks/:id

Returns a specific task.

Access Rules

admin can view any task.
manager can view tasks within their department.
employee can view only tasks assigned to them.

Example

GET /api/tasks/TASK_ID

Successful Response

{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {}
}

Create Task

### Access

- `admin` can create tasks across the organization.
- `manager` can create tasks within their department.
- `employee` cannot create tasks.

POST /api/tasks

Creates a new task.

Request Body

{
  "title": "Prepare monthly report",
  "description": "Prepare and submit the department's monthly report.",
  "assignedTo": "USER_ID",
  "priority": "high",
  "dueDate": "2026-10-05T17:00:00.000Z"
}

Validation

title is required.
assignedTo is required.
priority must be low, medium, or high.
dueDate must be a valid ISO 8601 date.
The assigned user must exist.
The assigned user must be active.
The assigned user must have the employee role.

The task's assignedBy value is taken from the authenticated user.

The task's department is determined from the assigned employee's department.

Successful Response

{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}

Update Task

PATCH /api/tasks/:id

Updates the details of an existing task.

Request Body

Any supported task fields can be updated according to the user's permissions.

Example:

{
  "title": "Prepare updated monthly report",
  "description": "Submit the updated report before the deadline.",
  "priority": "medium",
  "dueDate": "2026-10-07T17:00:00.000Z"
}


Access Rules

Employees cannot edit task details.

Managers can update tasks within their department.

Administrators can update tasks across the organization.

When a task is reassigned, the task's department follows the new employee's department.

Update Task Status

PATCH /api/tasks/:id/status

Updates the status of a task.

Request Body

{
  "status": "in-progress"
}

Supported statuses:

pending
in-progress
completed

Access Rules

Employees can update the status of tasks assigned to them.

Managers can update task status within their department.

Administrators can update task status across the organization.

Completed Tasks

When a task status changes to completed, the backend automatically sets completedAt.

When a completed task is changed to another status, completedAt is cleared.

Successful Response

{
  "success": true,
  "message": "Task status updated successfully",
  "data": {}
}

Delete Task

DELETE /api/tasks/:id

Deletes a task.

Access Rules

admin can delete tasks across the organization.
manager can delete tasks within their department.
employee cannot delete tasks.

Successful Response

{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}

Task Access Summary

| Operation          | Admin |        Manager |       Employee |
| ------------------ | ----: | -------------: | -------------: |
| View tasks         |   All | Own department | Assigned tasks |
| View task details  |   All | Own department | Assigned tasks |
| Create task        |   Yes |     Department |             No |
| Edit task details  |   Yes |     Department |             No |
| Update task status |   Yes |     Department |      Own tasks |
| Delete task        |   Yes |     Department |             No |


Authorization is enforced by the backend.

Task Business Rules

The backend enforces the following rules:

Tasks must be assigned to an active employee.
An inactive employee cannot receive a new task.
A task's department is based on the assigned employee's department.
Managers cannot assign tasks outside their department.
Employees cannot edit task details.
Employees can update the status of their own assigned tasks.
Completing a task automatically sets completedAt.
Changing a completed task back to another status clears completedAt.
Tasks can be filtered by status, priority, department, and assigned employee.
Task searches can match the title or description.
Overdue tasks are tasks whose due date has passed and whose status is not completed.


Overdue Tasks

A task is considered overdue when:

dueDate < current time
AND
status != completed

The API includes an overdue indicator when returning task information.

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

Task Not Found

{
  "success": false,
  "message": "Task not found",
  "data": null
}

Invalid Task Data

{
  "success": false,
  "message": "Validation failed",
  "data": []
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
| `201`       | Task created successfully           |
| `400`       | Invalid request or validation error |
| `401`       | Authentication required             |
| `403`       | User is not authorized              |
| `404`       | Task not found                      |
| `500`       | Server error                        |


Task Endpoints

| Method | Endpoint                | Purpose             |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/tasks`            | Get tasks           |
| GET    | `/api/tasks/:id`        | Get a task          |
| POST   | `/api/tasks`            | Create a task       |
| PATCH  | `/api/tasks/:id`        | Update task details |
| PATCH  | `/api/tasks/:id/status` | Update task status  |
| DELETE | `/api/tasks/:id`        | Delete a task       |


Testing with Postman

Recommended task API tests:

Login as an administrator.
Get the list of tasks.
Get a task by ID.
Create a task and assign it to an active employee.
Update task details.
Update the task status to in-progress.
Update the task status to completed.
Verify that completedAt is automatically set.
Change the task status back to pending.
Verify that completedAt is cleared.
Test task filtering and search.
Test manager department restrictions.
Test employee access restrictions.
Test task deletion.
Test requests without authentication.
Test invalid task data.
Test an invalid task ID.