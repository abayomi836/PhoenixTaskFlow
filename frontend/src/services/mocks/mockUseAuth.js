// mockUseAuth.js
// TEMPORARY stand-in for Member 2's real AuthContext hook, so Dashboard
// (and later Employees/Departments) can be built and previewed without
// waiting on the auth module to be finished.
//
// DO NOT keep this wired in long-term. Once Member 2's real
// context/AuthContext.jsx exists, delete this file and switch the import
// in your pages back to the real `useAuth` from "../context/AuthContext".
//
// To preview a different role locally, just change MOCK_ROLE below.

const MOCK_ROLE = "admin"; // change to "manager" or "employee" to preview

const MOCK_USERS = {
  admin: {
    _id: "emp001",
    name: "Amaka Obi",
    email: "amaka.obi@phoenixtaskflow.com",
    role: "admin",
    position: "Head Administrator",
    department: { id: "dept001", name: "Operations" },
    isActive: true,
  },
  manager: {
    _id: "emp002",
    name: "Daniel Mensah",
    email: "daniel.mensah@phoenixtaskflow.com",
    role: "manager",
    position: "Academic Coordinator",
    department: { id: "dept002", name: "Academic" },
    isActive: true,
  },
  employee: {
    _id: "emp003",
    name: "Chidi Nwosu",
    email: "chidi.nwosu@phoenixtaskflow.com",
    role: "employee",
    position: "Teacher",
    department: { id: "dept002", name: "Academic" },
    isActive: true,
  },
};

export const useAuth = () => {
  return { user: MOCK_USERS[MOCK_ROLE] };
};
