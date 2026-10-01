import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import fullLogo from '../assets/ptf-full-logo.png'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Login failed. Please check your email and password.',
      )
    } finally {
      setLoading(false)
    }
  }

    return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <div className="auth-brand">
          <img
            src={fullLogo}
            alt="PhoenixTASKFLOW"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <p className="auth-eyebrow">Welcome back</p>
          <h1 id="login-heading">Sign in to your account</h1>
          <p>
            Access your tasks, track progress, and stay on top of your work.
          </p>
        </div>

        <div className="card auth-form-card">
          <form onSubmit={handleSubmit} className="auth-form">
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
      autoComplete="current-password"
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

            {error && (
              <p className="alert alert-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
