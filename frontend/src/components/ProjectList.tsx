import type { Project } from '../types'

type ProjectListProps = {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const visibleProjects = projects.filter((project) => project.display)

  if (visibleProjects.length === 0) {
    return <p className="empty-state">No projects are available right now.</p>
  }

  return (
    <section className="projects-section">
      <div className="section-header">
        <h2>What type of project do you have in mind?</h2>
        {/* <p>Current work and recent engagements, grouped by category.</p> */}
      </div>
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <article key={project.id} className="project-card">
            <div className="project-card-top">
              <span className="project-category">{project.category}</span>
              <div className="project-links">
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">
                    Live
                  </a>
                ) : null}
                {project.githref ? (
                  <a href={project.githref} target="_blank" rel="noreferrer">
                    Code
                  </a>
                ) : null}
              </div>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="project-tags">
              {project.tech.map((tech) => (
                <span key={`${project.id}-${tech}`} className="project-tag">
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
