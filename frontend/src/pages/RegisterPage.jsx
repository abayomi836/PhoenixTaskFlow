import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getDepartments } from '../services/departmentService'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [position, setPosition] = useState('')
  const [department, setDepartment] = useState('')

  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] =
    useState(true)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartments()
        setDepartments(data)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load departments.',
        )
      } finally {
        setDepartmentsLoading(false)
      }
    }

    loadDepartments()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!department) {
      setError('Please select a department.')
      return
    }

    setLoading(true)

    try {
      await register({
        name,
        email,
        password,
        position,
        department,
      })

      navigate('/login')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

    return (
    <main className="auth-page">
      <section className="auth-card register-card" aria-labelledby="register-heading">
        <div className="auth-brand">
          <img
            src="/src/assets/ptf-full-logo.png"
            alt="PhoenixTASKFLOW"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <p className="auth-eyebrow">Get started</p>
          <h1 id="register-heading">Create your account</h1>
          <p>
            Join PhoenixTASKFLOW and start managing your work efficiently.
          </p>
        </div>

        <div className="card auth-form-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label htmlFor="name">Full name</label>
              <input
                className="input"
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email address</label>
              <input
                className="input"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="password-field">
  <label htmlFor="password">Password</label>

  <div className="password-input-wrapper">
    <input
      className="input"
      id="password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      autoComplete="new-password"
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword((current) => !current)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
</div>

            <div>
              <label htmlFor="position">Position</label>
              <input
                className="input"
                id="position"
                type="text"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <select
                className="select"
                id="department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
                disabled={departmentsLoading}
              >
                <option value="">
                  {departmentsLoading
                    ? 'Loading departments...'
                    : 'Select a department'}
                </option>

                {departments.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="alert alert-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || departmentsLoading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage