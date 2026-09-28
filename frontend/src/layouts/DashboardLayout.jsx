import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardLayout() {
const { user, logout } = useAuth()
const [menuOpen, setMenuOpen] = useState(false)
const navigate = useNavigate()

const closeMenu = () => {
setMenuOpen(false)
}

const handleLogout = () => {
logout()
navigate('/login')
}

return (
<div className="dashboard-layout">
<aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
<div className="sidebar-brand">
<h1>PhoenixTASKFLOW</h1>
<span>Assign. Track. Complete.</span>
</div>

<nav className="sidebar-nav">
<NavLink to="/dashboard" onClick={closeMenu}>
Dashboard
</NavLink>

<NavLink to="/tasks" onClick={closeMenu}>
Tasks
</NavLink>

<NavLink to="/employees" onClick={closeMenu}>
Employees
</NavLink>

<NavLink to="/departments" onClick={closeMenu}>
Departments
</NavLink>

<NavLink to="/profile" onClick={closeMenu}>
Profile
</NavLink>
</nav>
</aside>

{menuOpen && (
<div className="sidebar-overlay" onClick={closeMenu}></div>
)}

<div className="dashboard-main">
<header className="navbar">
<button
className="menu-button"
type="button"
onClick={() => setMenuOpen(!menuOpen)}
aria-label="Toggle navigation menu"
>
☰
</button>

<div className="navbar-user">
{user && (
<>
<strong>{user.name}</strong>
<span>{user.role}</span>
</>
)}

<button
className="btn btn-secondary"
type="button"
onClick={handleLogout}
>
Logout
</button>
</div>
</header>

<main className="dashboard-content">
<Outlet />
</main>
</div>
</div>
)
}

export default DashboardLayout
