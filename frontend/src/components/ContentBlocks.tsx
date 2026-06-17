import type { Content } from '../types'

type ContentBlocksProps = {
  contents: Content[]
}

function sectionClassName(section: string) {
  return `content-section section-${section
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`
}

export default function ContentBlocks({ contents }: ContentBlocksProps) {
  if (contents.length === 0) {
    return <p className="empty-state">No content has been published yet.</p>
  }

  const sections = contents.reduce<Record<string, Content[]>>((acc, item) => {
    const key = item.section?.trim() || 'General'
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="content-blocks">
      {Object.entries(sections).map(([section, items]) => (
        <section key={section} className={sectionClassName(section)}>
          {/* <div className="content-section-header">
            <h2>{section}</h2>
          </div> */}
          <div className="content-items">
            {items.map((item) => (
              <article key={item.id} className="content-card">
                {/* {item.category ? <span className="content-category">{item.category}</span> : null} */}
                <h2>{item.blurb}</h2>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
