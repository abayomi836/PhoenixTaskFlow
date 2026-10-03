import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService'
import whiteLogo from '../assets/ptf-white-logo.png'
import compactLogo from '../assets/ptf-compact-logo.png'

function DashboardLayout() {
const { user, logout } = useAuth()
const [menuOpen, setMenuOpen] = useState(false)
const [notifications, setNotifications] = useState([])
const [notificationOpen, setNotificationOpen] = useState(false)
const [profileOpen, setProfileOpen] = useState(false)
const navigate = useNavigate()

const closeMenu = () => {
setMenuOpen(false)
}

const handleLogout = () => {
logout()
navigate('/login')
}

useEffect(() => {
const loadNotifications = async () => {
  try {
    const data = await getNotifications()
    setNotifications(data)
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
}

if (user) {
  loadNotifications()
}
}, [user])

const unreadCount = notifications.filter(
  (notification) => !notification.isRead
).length

const handleNotificationClick = async (notification) => {
  try {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id)

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      )
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}


const handleMarkAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead()

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    )
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}


return (
<div className="dashboard-layout">
<aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
<div className="sidebar-brand">
  <img
    src={whiteLogo}
    alt="PhoenixTASKFLOW"
    className="sidebar-logo"
  />
</div>

<nav className="sidebar-nav">
<NavLink to="/dashboard" onClick={closeMenu}>
Dashboard
</NavLink>

<NavLink to="/tasks" onClick={closeMenu}>
Tasks
</NavLink>

{(user?.role === 'admin' || user?.role === 'manager') && (
  <NavLink to="/employees" onClick={closeMenu}>
    Employees
  </NavLink>
)}

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
<div className="mobile-navbar-brand">
  <img
    src={compactLogo}
    alt="PhoenixTASKFLOW"
    className="mobile-navbar-logo"
  />
  <span>PhoenixTASKFLOW</span>
</div>

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
  <div className="navbar-profile-wrapper">
    <button
      type="button"
      className="navbar-profile-button"
      aria-label="Open profile menu"
      aria-expanded={profileOpen}
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <span className="navbar-avatar" aria-hidden="true">
        {user.name?.charAt(0).toUpperCase()}
      </span>

      <span className="navbar-profile-arrow" aria-hidden="true">
        ▾
      </span>
    </button>

    {profileOpen && (
      <div className="navbar-profile-dropdown">
        <div className="navbar-profile-details">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>

        <div className="navbar-profile-divider"></div>

        <button
          type="button"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}

<div className="notification-wrapper">
    <button
      type="button"
      className="notification-button"
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      aria-expanded={notificationOpen}
      onClick={() => setNotificationOpen(!notificationOpen)}
    >
      <span className="notification-icon" aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 5.79 16.21 4 14 4H10C7.79 4 6 5.79 6 8V13.5L4 17H20L18 13.5V8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 20C10.1 20.62 10.98 21 12 21C13.02 21 13.9 20.62 14.5 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>

    {notificationOpen && (
      <div className="notification-panel">
        <div className="notification-panel-header">
          <h2>Notifications</h2>

          {unreadCount > 0 && (
            <button
              type="button"
              className="mark-all-read-button"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="notification-empty">
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.isRead ? 'notification-unread' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleNotificationClick(notification)
                  }
                }}
              >
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
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