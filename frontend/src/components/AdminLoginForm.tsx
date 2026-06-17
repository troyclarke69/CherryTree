import { useState } from 'react'
import type { LoginPayload } from '../types'

type AdminLoginFormProps = {
  onLogin: (payload: LoginPayload) => Promise<void>
  error?: string
}

export default function AdminLoginForm({ onLogin, error }: AdminLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      await onLogin({ email, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-card">
      <h3>Admin login</h3>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </div>
  )
}
