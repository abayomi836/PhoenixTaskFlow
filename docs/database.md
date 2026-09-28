# Database Documentation

## Overview

PhoenixTASKFLOW uses **MongoDB** as its database and **Mongoose** as the Object Data Modeling (ODM) library for MongoDB.

The database contains three main collections:

- `users`
- `departments`
- `tasks`

The collections are related through MongoDB ObjectId references.

---

## Users Collection

The `users` collection stores information about employees, managers, and administrators.

### User Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique user identifier |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Hashed password |
| `role` | String | Yes | `admin`, `manager`, or `employee` |
| `position` | String | Yes | User's organizational position |
| `department` | ObjectId | Yes | Reference to a department |
| `isActive` | Boolean | Yes | Indicates whether the account is active |
| `createdAt` | Date | Automatic | Record creation date |
| `updatedAt` | Date | Automatic | Last update date |

Passwords are hashed using `bcryptjs` and are not returned in API responses.

---

## Departments Collection

The `departments` collection stores the departments available within the organization.

### Department Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique department identifier |
| `name` | String | Yes | Department name |
| `description` | String | No | Department description |
| `isActive` | Boolean | Yes | Indicates whether the department is active |
| `createdAt` | Date | Automatic | Record creation date |
| `updatedAt` | Date | Automatic | Last update date |

Department names must be unique.

Departments are deactivated rather than physically deleted.

---

## Tasks Collection

The `tasks` collection stores tasks assigned to employees.

### Task Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique task identifier |
| `title` | String | Yes | Task title |
| `description` | String | No | Task description |
| `assignedTo` | ObjectId | Yes | User responsible for the task |
| `assignedBy` | ObjectId | Yes | User who created or assigned the task |
| `department` | ObjectId | Yes | Department responsible for the task |
| `priority` | String | Yes | `low`, `medium`, or `high` |
| `status` | String | Yes | `pending`, `in-progress`, or `completed` |
| `dueDate` | Date | Yes | Task deadline |
| `completedAt` | Date | No | Date the task was completed |
| `createdAt` | Date | Automatic | Record creation date |
| `updatedAt` | Date | Automatic | Last update date |

---

## Relationships

PhoenixTASKFLOW uses ObjectId references to connect related records.

### User and Department

Each user belongs to one department.

```text
User
  │
  └── department ──→ Department

Task and Users

Each task references the user responsible for completing it and the user who assigned it.

Task
 ├── assignedTo ──→ User
 └── assignedBy ──→ User

Task and Department

Each task belongs to a department.

Task
  │
  └── department ──→ Department

Relationship Overview

Department
    ↑
    │
    ├──────── User
    │            ↑
    │            │
    │            ├── assignedTo ── Task
    │            │
    │            └── assignedBy ── Task
    │
    └──────── Task


User Roles

The system supports three user roles:

Admin

Administrators have organization-wide access.

They can manage departments and employees and access organization-wide task information.

Manager

Managers manage users and tasks within their own department.

Employee

Employees can access their own profile and assigned tasks.

They can update the status of tasks assigned to them.


Data and Business Rules

The backend enforces the following database-related rules:

User email addresses must be unique.
Department names must be unique.
Users must belong to an active department when an account is created or updated.
New users receive the employee role by default during public registration.
Inactive users cannot receive new tasks.
Tasks must be assigned to an active employee.
A manager can only manage users and tasks within their department.
An employee can only access tasks assigned to them.
A task's department follows the department of its assigned employee.
A completed task receives a completedAt timestamp.
When a completed task is changed to another status, completedAt is cleared.
User passwords are stored as bcrypt hashes.
Passwords are excluded from user API responses.
Departments are deactivated instead of physically deleted.


Timestamps

The User, Department, and Task schemas use Mongoose timestamps.

Mongoose automatically maintains:

createdAt
updatedAt

createdAt records when a document was created, while updatedAt records the most recent update.


Database Technology

Component					Technology
Database					MongoDB
ODM						Mongoose
Authentication password hashing			bcryptjs
Primary identifier				MongoDB ObjectId

Database Structure Summary

MongoDB
│
├── users
│   ├── name
│   ├── email
│   ├── password
│   ├── role
│   ├── position
│   ├── department
│   └── isActive
│
├── departments
│   ├── name
│   ├── description
│   └── isActive
│
└── tasks
    ├── title
    ├── description
    ├── assignedTo
    ├── assignedBy
    ├── department
    ├── priority
    ├── status
    ├── dueDate
    └── completedAt