import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getDepartments } from '../services/departmentService'

function ProfilePage() {
  const { user } = useAuth()

  const [departmentName, setDepartmentName] = useState('—')
  const [loadingDepartment, setLoadingDepartment] = useState(true)

  useEffect(() => {
    let active = true

    const loadDepartment = async () => {
      if (!user?.department) {
        setLoadingDepartment(false)
        return
      }

      try {
        const departments = await getDepartments()

        const department = departments.find(
          (item) => item._id === user.department
        )

        if (active) {
          setDepartmentName(department?.name || '—')
        }
      } catch {
        if (active) {
          setDepartmentName('Unable to load')
        }
      } finally {
        if (active) {
          setLoadingDepartment(false)
        }
      }
    }

    loadDepartment()

    return () => {
      active = false
    }
  }, [user?.department])

  if (!user) {
    return (
      <main>
        <h1>Profile</h1>
        <p role="status">Loading profile...</p>
      </main>
    )
  }

    return (
    <main className="profile-page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Account</p>
          <h1>My Profile</h1>
          <p className="page-description">
            View your account information and organization details.
          </p>
        </div>
      </header>

      <section className="profile-card" aria-labelledby="profile-information-heading">
        <div className="profile-card-header">
          <div className="profile-avatar" aria-hidden="true">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.position || 'PhoenixTASKFLOW User'}</p>
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-information">
          <h2 id="profile-information-heading">Personal Information</h2>

          <dl className="profile-details">
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>

            <div>
              <dt>Position</dt>
              <dd>{user.position || '—'}</dd>
            </div>

            <div>
              <dt>Role</dt>
              <dd>
                <span className="badge badge-blue">{user.role}</span>
              </dd>
            </div>

            <div>
              <dt>Department</dt>
              <dd>
                {loadingDepartment ? 'Loading...' : departmentName}
              </dd>
            </div>

            <div>
              <dt>Account Status</dt>
              <dd>
                <span
                  className={`badge ${
                    user.isActive ? 'badge-green' : 'badge-red'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage