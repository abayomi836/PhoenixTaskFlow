import { useState } from 'react'
import { Link } from 'react-router-dom'
import fullLogo from '../assets/ptf-full-logo.png'
import { forgotPassword } from '../services/authService'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await forgotPassword(email)

setMessage(response.message)

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
      <section className="auth-card" aria-labelledby="forgot-password-heading">
        <div className="auth-brand">
          <img
            src={fullLogo}
            alt="PhoenixTASKFLOW"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <p className="auth-eyebrow">Account recovery</p>
          <h1 id="forgot-password-heading">Forgot your password?</h1>
          <p>
            Enter your email address and we will send you a link to reset your
            password.
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
              {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage