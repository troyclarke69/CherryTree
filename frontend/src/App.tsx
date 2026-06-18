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
           <img
            className="eyebrow"
            src="/images/ct-410x410.png"
            style={{  
                    position: 'absolute',
                    top: 10,
                    left: 10,       
                    width: '250px', 
                    height: 'auto' ,
                    // border: '2px solid grey',
                    boxShadow: '0px 0px 0px 0px rgba(133, 120, 120, 0.25)'
                    // borderRadius: '8px'
            }} 
            alt="CherryTreeCo."
          />
          {/* <h2>Slightly distracted by shiny things.</h2> */}
        </div>
      </header>

      {isLoading ? (
        <div className="loading-state">Loading content...</div>
      ) : view === 'home' ? (
        <div className="page-content">

          <div className="header-tag">
            {/* <h2>{heroContent?.section || 'Welcome'}</h2> */}
            <h2>Delivering modern websites, polished messaging, 
                and reliable business operations.</h2>
          </div>

          <ContentBlocks contents={contents} />
          <ProjectList projects={projects} />

          <section className="contact-grid">
            <div className="contact-panel">
              <h2>Contact us to start building</h2>
              <h4>
                Let us help you shape the next version of your business website,
                launch a new product story, or turn your content into a clean,
                modern digital presence.
              </h4>
            </div>
            <ContactForm onSubmit={handleContactSubmit} />
          </section>

          <footer className="app-footer">
            {/* <div className="footer-card">
              <strong>Ready when you are</strong>
              <p>More resources and quick links will appear here soon.</p>
            </div>
            <div className="footer-card">
              <strong>Additional link</strong>
              <p>Placeholder content for later navigation items.</p>
            </div> */}
            <div className="footer-card">
              <strong>Company info</strong>
              <p>Who works for this co.? This <a href="https://troyclarke2026.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  guy.
                </a>   
              </p>
             </div>
               <div className="footer-card">
              <strong></strong>
              <p></p>
            </div> 
             <div className="footer-card">
              <strong>Admin</strong>
              <button
                type="button"
                className="footer-admin-button"
                onClick={() => setView('admin')}
              >
                Admin
              </button>
            </div>
          </footer>
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

      {/* <nav className="top-nav">
          <button type="button" onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>
            Home
          </button>
          <button type="button" onClick={() => setView('admin')} className={view === 'admin' ? 'active' : ''}>
            Admin
          </button>
          {adminToken ? (
            <button type="button" onClick={handleLogout} className="logout-button">
              Log out
            </button>
          ) : null}
        </nav> */}
    </main>
  )
}

export default App
