import { useEffect, useMemo, useState } from 'react'
import './App.css'
import ContentBlocks from './components/ContentBlocks'
import ProjectList from './components/ProjectList'
import ContactForm from './components/ContactForm'
import AdminLoginForm from './components/AdminLoginForm'
import AdminSection from './components/AdminSection'
import SplashPage from './components/SplashPage'
import {
  adminCreateContent,
  adminCreateProject,
  adminDeleteContent,
  adminDeleteProject,
  adminLogin,
  getContents,
  getProjects,
  postContact,
} from './lib/api'
import type { Content, ContactPayload, LoginPayload, Project, ProjectCreatePayload } from './types'

const STORAGE_KEY = 'cherrytree_admin_token'

type View = 'splash' | 'home' | 'admin'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<View>('splash')
  const [adminToken, setAdminToken] = useState<string | null>(
                () => window.localStorage.getItem(STORAGE_KEY))
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [projectResults, contentResults] = await Promise.all([getProjects(), getContents()])
        setProjects(projectResults)
        setContents(contentResults)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (adminToken) {
      window.localStorage.setItem(STORAGE_KEY, adminToken)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [adminToken])

  const projectCategories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))).sort(),
    [projects],
  )

  async function handleContactSubmit(payload: ContactPayload) {
    await postContact(payload)
  }

  async function handleAdminLogin(payload: LoginPayload) {
    setAdminError('')
    try {
      const response = await adminLogin(payload)
      setAdminToken(response.access_token)
      setView('admin')
    } catch (error) {
      setAdminError((error as Error).message)
    }
  }

  async function handleCreateProject(payload: ProjectCreatePayload) {
    if (!adminToken) return
    const newProject = await adminCreateProject(payload, adminToken)
    setProjects((current) => [newProject, ...current])
  }

  async function handleDeleteProject(projectId: string) {
    if (!adminToken) return
    await adminDeleteProject(projectId, adminToken)
    setProjects((current) => current.filter((project) => project.id !== projectId))
  }

  async function handleCreateContent(payload: Omit<Content, 'id'>) {
    if (!adminToken) return
    const newContent = await adminCreateContent(payload, adminToken)
    setContents((current) => [newContent, ...current])
  }

  async function handleDeleteContent(contentId: string) {
    if (!adminToken) return
    await adminDeleteContent(contentId, adminToken)
    setContents((current) => current.filter((contentItem) => contentItem.id !== contentId))
  }

  function handleLogout() {
    setAdminToken(null)
    setView('home')
  }

  const heroContent = contents.find((item) => item.section.toLowerCase() === 'hero')

  if (view === 'splash') {
    return <SplashPage onEnter={() => setView('home')} />
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-copy">
          <h2 className="eyebrow">CherryTreeCo.</h2>
          <h1>-- Let's make it work.</h1>
        </div>
      </header>

      {isLoading ? (
        <div className="loading-state">Loading content...</div>
      ) : view === 'home' ? (
        <div className="page-content">

          {/* <section className="hero-section">
            <div className="hero-copy">
              <h2>{heroContent?.section || 'Welcome'}</h2>
              <p>{heroContent?.blurb || 'Delivering modern websites, polished messaging, and reliable business operations.'}</p>
            </div>
            {projectCategories.length > 0 ? (
              <div className="hero-categories">
                {projectCategories.map((category) => (
                  <span key={category} className="hero-chip">
                    {category}
                  </span>
                ))}
              </div>
            ) : null}
          </section> */}

          <ContentBlocks contents={contents} />
          <ProjectList projects={projects} />

          <section className="contact-grid">
            <div className="contact-panel">
              <h2>Contact us to start building</h2>
              <p>
                Let us help you shape the next version of your business website,
                launch a new product story, or turn your content into a clean,
                modern digital presence.
              </p>
            </div>
            <ContactForm onSubmit={handleContactSubmit} />
          </section>
        </div>
      ) : adminToken ? (
        <AdminSection
          projects={projects}
          contents={contents}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          onCreateContent={handleCreateContent}
          onDeleteContent={handleDeleteContent}
        />
      ) : (
        <div className="page-content admin-login-shell">
          <AdminLoginForm onLogin={handleAdminLogin} error={adminError} />
        </div>
      )}

      <nav className="top-nav">
          {/* <button type="button" onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>
            Home
          </button> */}
          <button type="button" onClick={() => setView('admin')} className={view === 'admin' ? 'active' : ''}>
            Admin
          </button>
          {adminToken ? (
            <button type="button" onClick={handleLogout} className="logout-button">
              Log out
            </button>
          ) : null}
        </nav>
    </main>
  )
}

export default App
