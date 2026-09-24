# PhoenixTASKFLOW — Database Design

## 1. Database Technology

PhoenixTASKFLOW uses:

- MongoDB as the database
- Mongoose as the ODM (Object Data Modeling) library

The application uses three core collections:

- users
- departments
- tasks

---

## 2. Users Collection

The `users` collection stores employee and administrator account information.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique identifier |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | User's unique email address |
| `password` | String | Yes | Hashed user password |
| `role` | String | No | User authorization role |
| `position` | String | Yes | User's job position |
| `department` | ObjectId | Yes | Reference to a Department |
| `isActive` | Boolean | No | Indicates whether the account is active |
| `createdAt` | Date | Automatic | Account creation date |
| `updatedAt` | Date | Automatic | Last update date |

### Roles

The available roles are:

- `admin`
- `manager`
- `employee`

The default role is `employee`.

Passwords must be hashed before they are stored in the database.

---

## 3. Departments Collection

The `departments` collection stores organizational departments.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique identifier |
| `name` | String | Yes | Department name |
| `description` | String | No | Description of the department |
| `isActive` | Boolean | No | Indicates whether the department is active |
| `createdAt` | Date | Automatic | Department creation date |
| `updatedAt` | Date | Automatic | Last update date |

Department names must be unique.

---

## 4. Tasks Collection

The `tasks` collection stores work assigned to employees.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | Unique identifier |
| `title` | String | Yes | Task title |
| `description` | String | No | Task description |
| `assignedTo` | ObjectId | Yes | User assigned to the task |
| `assignedBy` | ObjectId | Yes | User who assigned the task |
| `department` | ObjectId | Yes | Department associated with the task |
| `priority` | String | No | Task priority |
| `status` | String | No | Current task status |
| `dueDate` | Date | Yes | Task deadline |
| `completedAt` | Date | No | Date the task was completed |
| `createdAt` | Date | Automatic | Task creation date |
| `updatedAt` | Date | Automatic | Last update date |

### Priority Values

- `low`
- `medium`
- `high`

The default priority is `medium`.

### Status Values

- `pending`
- `in-progress`
- `completed`

The default status is `pending`.

`completedAt` is initially `null`.

---

## 5. Database Relationships

### User → Department

Each user belongs to a department.

```text
User
 └── department → Department

 Task → User

Each task has:

an assignedTo user
an assignedBy user
Task
 ├── assignedTo → User
 └── assignedBy → User
Task → Department

Each task belongs to a department.

Task
 └── department → Department

 ## 6. Overall Database Structure

```text
                 ┌───────────────┐
                 │  Departments  │
                 └───────┬───────┘
                         │
                    department
                         │
                 ┌───────▼───────┐
                 │     Users     │
                 └───────┬───────┘
                         │
                 assignedTo /
                 assignedBy
                         │
                 ┌───────▼───────┐
                 │     Tasks     │
                 └───────┬───────┘
                         │
                     department
                         │
                 ┌───────▼───────┐
                 │  Departments  │
                 └───────────────┘

                 ## 7. Important Database Rules

The database schemas establish the basic structure and validation for PhoenixTASKFLOW.

Additional business rules will be enforced by the backend services and controllers.

Examples include:

- Only active employees should receive new tasks.
- Managers can only assign tasks within their department.
- Employees can only update the status of tasks assigned to them.
- Employees cannot change task assignment or task details.
- When a task becomes `completed`, the backend sets `completedAt`.
- When a completed task is changed back to another status, `completedAt` should be cleared.
- Inactive users should not receive new tasks.
- Departments can be deactivated rather than permanently removed.

## 8. Mongoose Timestamps

The three models use Mongoose timestamps.

Mongoose automatically maintains:

- `createdAt`
- `updatedAt`

This allows the system to track when records were created and last modified.