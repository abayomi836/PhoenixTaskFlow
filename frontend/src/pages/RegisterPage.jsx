import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [position, setPosition] = useState('')
const [department, setDepartment] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const { register } = useAuth()
const navigate = useNavigate()

const handleSubmit = async (event) => {
event.preventDefault()
setError('')
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
onChange={(event) => setName(event.target.value)}
required
/>
</div>

<div>
<label htmlFor="email">Email</label>
<input
id="email"
type="email"
value={email}
onChange={(event) => setEmail(event.target.value)}
required
/>
</div>

<div>
<label htmlFor="password">Password</label>
<input
id="password"
type="password"
value={password}
onChange={(event) => setPassword(event.target.value)}
required
/>
</div>

<div>
<label htmlFor="position">Position</label>
<input
id="position"
type="text"
value={position}
onChange={(event) => setPosition(event.target.value)}
required
/>
</div>

<div>
<label htmlFor="department">Department</label>
<input
id="department"
type="text"
value={department}
onChange={(event) => setDepartment(event.target.value)}
required
/>
</div>

{error && <p>{error}</p>}

<button type="submit" disabled={loading}>
{loading ? 'Registering...' : 'Register'}
</button>
</form>
</div>
)
}

export default RegisterPage
