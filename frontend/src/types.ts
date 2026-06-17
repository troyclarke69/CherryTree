export type Project = {
  id: string
  title: string
  category: string
  summary: string
  tech: string[]
  href: string | null
  githref: string | null
  display: boolean
}

export type ProjectCreatePayload = Omit<Project, 'id'>

export type Content = {
  id: string
  category: string | null
  section: string
  blurb: string
}

export type ContentCreatePayload = Omit<Content, 'id'>

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
}
