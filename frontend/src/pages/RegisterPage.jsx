import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getDepartments } from '../services/departmentService'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="position">Position</label>

          <input
            id="position"
            type="text"
            value={position}
            onChange={(event) =>
              setPosition(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="department">
            Department
          </label>

          <select
            id="department"
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            required
            disabled={departmentsLoading}
          >
            <option value="">
              {departmentsLoading
                ? 'Loading departments...'
                : 'Select a department'}
            </option>

            {departments.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={
            loading || departmentsLoading
          }
        >
          {loading
            ? 'Registering...'
            : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage