# PhoenixTASKFLOW

**Assign. Track. Complete.**

PhoenixTASKFLOW is a full-stack Employee Task Management System designed to help organizations assign tasks, track progress, manage employees and departments, and monitor task completion from a centralized platform.

## Project Overview

PhoenixTASKFLOW provides role-based task and organization management for three user roles:

- **Admin** — manages users and departments across the organization.
- **Manager** — manages tasks and employees within the manager's department.
- **Employee** — views assigned tasks and updates the status of their own tasks.

The application uses a React frontend, a Node.js/Express backend, and MongoDB for persistent data storage. Authentication and authorization are handled with JWT and role-based access control.

## Key Features

### Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Admin, Manager, and Employee permissions
- Profile management
- Server-side authorization checks

### Task Management

- Create and assign tasks
- View task details
- Edit tasks
- Track task status
- Task priorities and due dates
- Task filtering and searching
- Pagination
- Role-based task visibility
- Automatic handling of task completion dates
- Prevention of assigning tasks to inactive employees

### User Management

Admins can:

- Create users
- View users
- Edit users
- Assign roles
- Assign departments
- Update employee positions
- Activate or deactivate accounts

The system prevents an administrator from deactivating their own account.

### Department Management

- View departments
- Admin-only department creation
- Department descriptions
- Department status
- Department-based management rules

### Dashboard

The dashboard provides role-specific information and task statistics based on the authenticated user's permissions and organizational scope.

### Responsive Interface

The frontend is designed for desktop and smaller screens, with accessible navigation, form labels, keyboard focus states, semantic HTML, and loading and error feedback.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Context API
- CSS

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator

### Development and Deployment

- Git and GitHub
- Postman
- Render
- MongoDB Atlas

## Project Structure

```text
PhoenixTaskFlow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── seedAdmin.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/
├── postman/
└── README.md
```

## Application Architecture

```text
User
 │
 ▼
React + Vite Frontend
 │
 │ Axios / REST API
 ▼
Node.js + Express Backend
 │
 │ Mongoose
 ▼
MongoDB Atlas
```

Authentication is handled by the backend using JWT tokens. Protected API routes use authentication middleware, while role-based middleware controls access to administrative and management operations.

## User Roles

| Role | Main Responsibilities |
|---|---|
| Admin | Organization-wide user and department management; task management |
| Manager | Manage tasks and employees within their department |
| Employee | View assigned tasks and update their own task status |

Authorization is enforced on the backend rather than relying only on frontend visibility.

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to the deployed backend API URL.

**Never commit `.env` files, API keys, database credentials, JWT secrets, or passwords to GitHub.**

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/abayomi836/PhoenixTaskFlow.git
cd PhoenixTaskFlow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create the backend `.env` file and provide the required environment variables.

### 3. Start the backend

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:5000
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend `.env` file and set:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the frontend

```bash
npm run dev
```

The Vite development server will provide the local frontend URL in the terminal.

## API

The backend provides REST API endpoints for:

- Authentication
- Users
- Departments
- Tasks
- Dashboard statistics

The detailed backend documentation contains the complete endpoint descriptions, request/response structures, validation rules, authentication requirements, and authorization rules.

Additional API testing resources are available in the `postman/` directory.

## Production Deployment

PhoenixTASKFLOW is deployed using Render for the frontend and backend, with MongoDB Atlas providing the production database.

### Frontend

https://phoenix-taskflow.onrender.com

### Backend

https://phoenix-taskflow-backend.onrender.com

The production frontend communicates with the deployed backend through the configured `VITE_API_URL` environment variable.

## Security

PhoenixTASKFLOW includes:

- JWT authentication
- Password hashing
- Protected API routes
- Role-based authorization
- Request validation with express-validator
- Server-side permission checks
- Department-scope enforcement for managers
- Active-user checks during task assignment
- Server-controlled task assignment relationships
- Prevention of administrator self-deactivation

## Testing

The backend API was tested during development using Postman, including authentication, authorization, user management, department management, task management, and dashboard functionality.

The deployed application was also tested for authentication, registration, task management, user management, department creation, and production database connectivity.

## Documentation

Detailed technical documentation is available in the `docs/` directory.

The backend documentation covers the backend architecture, API implementation, database models, authentication, authorization, validation, and testing.

## Capstone Project

PhoenixTASKFLOW was developed as a Full-Stack Capstone Project for TS Academy.

The project demonstrates:

- Frontend development
- Backend API development
- Database integration
- Authentication
- Authorization
- CRUD operations
- Validation
- Error handling
- Frontend/backend integration
- Responsive UI development
- API testing
- Production deployment

## Future Enhancements

Potential future improvements include:

- Email notifications for task assignments and updates
- Task comments and collaboration
- File attachments
- Advanced reporting and analytics
- Notification center
- More granular permissions
- Activity/audit logs
- Organization/workspace support
- Automated reminders for approaching deadlines

## Team

PhoenixTASKFLOW was developed as a collaborative capstone project involving frontend and backend development.

**Backend Development & Technical Coordination**

Kareem Abayomi

**Project:** PhoenixTASKFLOW  
**Tagline:** Assign. Track. Complete.
