'use client'
import { useState } from 'react'
import { experiences, type Experience } from '@/data/experience'

export default function ExperienceSection() {
  const [active, setActive] = useState<Experience['id'] | null>(null)
  const popover = experiences.find(e => e.id === active)

  const toggle = (id: Experience['id']) =>
    setActive(prev => (prev === id ? null : id))

  return (
    <section id="experience" className="section">
      <div className="sec-label">experience</div>
      <div className="exp-row">
        {experiences.map(exp => (
          <button
            key={exp.id}
            className="exp-chip"
            onClick={() => toggle(exp.id)}
            aria-expanded={active === exp.id}
          >
            <div className="logo-sq" style={{ background: exp.logoColor }} />
            <div>
              <div className="exp-co">
                {exp.company}
                {exp.isCurrent && <span className="exp-now"> ● now</span>}
              </div>
              <div className="exp-role">{exp.role}</div>
            </div>
          </button>
        ))}
      </div>

      {popover && (
        <div key={active} className="popover-card">
          <div className="popover-header">
            <div className="logo-sq" style={{ background: popover.logoColor }} />
            <div>
              <div className="popover-company">{popover.company}</div>
              <div className="popover-role">{popover.role}</div>
            </div>
          </div>
          <div className="popover-dates">{popover.dateRange}</div>
          <p className="popover-desc">{popover.description}</p>
          {popover.link && (
            <a
              href={popover.link}
              target="_blank"
              rel="noopener noreferrer"
              className="nyx-link popover-link"
            >
              {popover.linkLabel}
            </a>
          )}
        </div>
      )}
    </section>
  )
}
