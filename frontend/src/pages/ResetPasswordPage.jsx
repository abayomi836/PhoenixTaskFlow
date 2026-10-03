import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import fullLogo from '../assets/ptf-full-logo.png'
import { resetPassword } from '../services/authService'

function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await resetPassword(
  token,
  password,
  confirmPassword,
)

setMessage(response.message)

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section
        className="auth-card"
        aria-labelledby="reset-password-heading"
      >
        <div className="auth-brand">
          <img
            src={fullLogo}
            alt="PhoenixTASKFLOW"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <p className="auth-eyebrow">Account recovery</p>
          <h1 id="reset-password-heading">Reset your password</h1>
          <p>
            Create a new password for your PhoenixTASKFLOW account.
          </p>
        </div>

        <div className="card auth-form-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="password-field">
              <label htmlFor="password">New password</label>

              <div className="password-input-wrapper">
                <input
                  className="input"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm password</label>

              <div className="password-input-wrapper">
                <input
                  className="input"
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="alert alert-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="alert alert-success" role="status">
                {message}
              </p>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>

            <div className="forgot-password-link">
              <Link to="/login">Back to Sign In</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ResetPasswordPage