import { useState } from 'react'
import type { ContactPayload } from '../types'

type ContactFormProps = {
  onSubmit: (payload: ContactPayload) => Promise<void>
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      await onSubmit({ name, email, message })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError((err as Error).message || 'Unable to submit the form.')
      setStatus('error')
    }
  }

  return (
    <section className="contact-section">
      <div className="section-header">
        <h2>Contact</h2>
        <p>Send a message and we'll follow up quickly.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder='name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
          />
        </label>
        <label>
          <input
            type="email"
            placeholder='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          <textarea
            value={message}
            placeholder='message'
            onChange={(event) => setMessage(event.target.value)}
            required
            minLength={10}
          />
        </label>
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' ? <p className="form-success">Message received. Thank you.</p> : null}
        {status === 'error' ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  )
}
