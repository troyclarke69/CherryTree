import type { Content, ContactPayload, LoginPayload, Project, ProjectCreatePayload, TokenResponse } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    const body = await response.text()
    const message = body ? `${response.status} ${response.statusText} - ${body}` : `${response.status} ${response.statusText}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null as unknown as T
  }

  return response.json() as Promise<T>
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getProjects(): Promise<Project[]> {
  return fetchJson<Project[]>(`${API_BASE}/api/projects`)
}

export function getContents(): Promise<Content[]> {
  return fetchJson<Content[]>(`${API_BASE}/api/Contents`)
}

export function postContact(payload: ContactPayload): Promise<void> {
  return fetchJson<void>(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function adminLogin(payload: LoginPayload): Promise<TokenResponse> {
  return fetchJson<TokenResponse>(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function adminCreateProject(payload: ProjectCreatePayload, token: string): Promise<Project> {
  return fetchJson<Project>(`${API_BASE}/api/admin/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload),
  })
}

export function adminDeleteProject(projectId: string, token: string): Promise<void> {
  return fetchJson<void>(`${API_BASE}/api/admin/projects/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export function adminCreateContent(payload: Omit<Content, 'id'>, token: string): Promise<Content> {
  return fetchJson<Content>(`${API_BASE}/api/admin/Contents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload),
  })
}

export function adminDeleteContent(contentId: string, token: string): Promise<void> {
  return fetchJson<void>(`${API_BASE}/api/admin/Contents/${contentId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
