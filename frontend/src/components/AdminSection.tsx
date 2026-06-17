import { useMemo, useState } from 'react'
import type { Content, Project } from '../types'

type AdminSectionProps = {
  projects: Project[]
  contents: Content[]
  onCreateProject: (payload: Omit<Project, 'id'>) => Promise<void>
  onDeleteProject: (projectId: string) => Promise<void>
  onCreateContent: (payload: Omit<Content, 'id'>) => Promise<void>
  onDeleteContent: (contentId: string) => Promise<void>
}

export default function AdminSection({
  projects,
  contents,
  onCreateProject,
  onDeleteProject,
  onCreateContent,
  onDeleteContent,
}: AdminSectionProps) {
  const [projectTitle, setProjectTitle] = useState('')
  const [projectCategory, setProjectCategory] = useState('')
  const [projectSummary, setProjectSummary] = useState('')
  const [projectTech, setProjectTech] = useState('')
  const [projectHref, setProjectHref] = useState('')
  const [projectGithref, setProjectGithref] = useState('')
  const [contentCategory, setContentCategory] = useState('')
  const [contentSection, setContentSection] = useState('')
  const [contentBlurb, setContentBlurb] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const createProjectPayload = useMemo(
    () => ({
      title: projectTitle,
      category: projectCategory,
      summary: projectSummary,
      tech: projectTech.split(',').map((item) => item.trim()).filter(Boolean),
      href: projectHref || null,
      githref: projectGithref || null,
      display: true,
    }),
    [projectTitle, projectCategory, projectSummary, projectTech, projectHref, projectGithref],
  )

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateProject(createProjectPayload)
    setMessage('Project saved successfully.')
    setProjectTitle('')
    setProjectCategory('')
    setProjectSummary('')
    setProjectTech('')
    setProjectHref('')
    setProjectGithref('')
  }

  async function handleContentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateContent({
      category: contentCategory || null,
      section: contentSection,
      blurb: contentBlurb,
    })
    setMessage('Content saved successfully.')
    setContentCategory('')
    setContentSection('')
    setContentBlurb('')
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2>Admin</h2>
        <p>Use this section to manage projects and page content.</p>
      </div>
      <div className="admin-forms-grid">
        <form className="admin-form" onSubmit={handleProjectSubmit}>
          <h3>Create project</h3>
          <label>
            Title
            <input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} required />
          </label>
          <label>
            Category
            <input value={projectCategory} onChange={(event) => setProjectCategory(event.target.value)} required />
          </label>
          <label>
            Summary
            <textarea value={projectSummary} onChange={(event) => setProjectSummary(event.target.value)} required />
          </label>
          <label>
            Tech (comma separated)
            <input value={projectTech} onChange={(event) => setProjectTech(event.target.value)} />
          </label>
          <label>
            Link
            <input value={projectHref} onChange={(event) => setProjectHref(event.target.value)} />
          </label>
          <label>
            Code link
            <input value={projectGithref} onChange={(event) => setProjectGithref(event.target.value)} />
          </label>
          <button type="submit">Create project</button>
        </form>

        <form className="admin-form" onSubmit={handleContentSubmit}>
          <h3>Create content</h3>
          <label>
            Section
            <input value={contentSection} onChange={(event) => setContentSection(event.target.value)} required />
          </label>
          <label>
            Category
            <input value={contentCategory} onChange={(event) => setContentCategory(event.target.value)} />
          </label>
          <label>
            Blurb
            <textarea value={contentBlurb} onChange={(event) => setContentBlurb(event.target.value)} required />
          </label>
          <button type="submit">Create content</button>
        </form>
      </div>

      {message ? <div className="admin-message">{message}</div> : null}

      <div className="admin-list-grid">
        <div>
          <h3>Projects</h3>
          <ul className="admin-list">
            {projects.map((project) => (
              <li key={project.id}>
                <span>{project.title}</span>
                <button type="button" onClick={() => onDeleteProject(project.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Content</h3>
          <ul className="admin-list">
            {contents.map((contentItem) => (
              <li key={contentItem.id}>
                <span>{contentItem.section} — {contentItem.category ?? 'General'}</span>
                <button type="button" onClick={() => onDeleteContent(contentItem.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
