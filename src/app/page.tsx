import PaintZone from '@/components/PaintZone'
import LocationWidget from '@/components/LocationWidget'
import ExperienceSection from '@/components/ExperienceSection'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'

export default function HomePage() {
  const featured = projects.filter(p => p.featured)

  return (
    <PaintZone>
      <section id="about" className="hero">
        <h1 className="hero-name">ayan bin saif</h1>
        <p className="hero-bio">
          <a
            href="https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing"
            target="_blank"
            rel="noopener noreferrer"
            className="nyx-link"
          >
            applied mathematics with scientific computing and scientific machine learning ↗
          </a>{' '}
          student at the <a href="https://uwaterloo.ca" target="_blank" rel="noopener noreferrer" className="nyx-link"><strong>university of waterloo ↗</strong></a>
          <br /><br />
          currently engineering at{' '}
          <a href="https://tern.ai" target="_blank" rel="noopener noreferrer" className="nyx-link">
            tern ↗
          </a>
          . interested in software engineering, data science, full-stack development, and mobile
          engineering.
        </p>
        <div className="hero-links">
          <a href="mailto:ayan.binsaif@uwaterloo.ca" className="nyx-link">email ↗</a>
          <span className="sep">·</span>
          <a href="https://github.com/draggle" target="_blank" rel="noopener noreferrer" className="nyx-link">github ↗</a>
          <span className="sep">·</span>
          <a href="https://linkedin.com/in/stitches" target="_blank" rel="noopener noreferrer" className="nyx-link">linkedin ↗</a>
          <span className="sep">·</span>
          <a
            href="https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nyx-link"
          >
            resume ↗
          </a>
        </div>
        <LocationWidget />
      </section>

      <ExperienceSection />

      <section id="projects" className="section">
        <div className="sec-label">projects</div>
        <div className="proj-grid">
          {featured.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
        <div className="view-all">
          <a href="/projects" className="nyx-link">view all projects →</a>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="sec-label">skills</div>
        <div className="skills-zone">
          <div className="paint-hint">✦ try clicking &amp; dragging</div>
          <div className="skill-row">
            <strong>languages</strong> · python, c, c++, typescript, javascript, swift, bash, java,
            racket, sql, html/css
          </div>
          <div className="skill-row">
            <strong>frameworks</strong> · next.js, react, react native, swiftui, node.js, tailwind
            css, opencv, mediapipe
          </div>
          <div className="skill-row">
            <strong>tools</strong> · docker, supabase, postgresql, firebase, git, unix/linux, xcode,
            vercel, figma, testflight
          </div>
          <div className="skill-row">
            <strong>concepts</strong> · dsa, restful api, multi-agent systems, oop, ui/ux design, hci
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <div className="footer-name">ayan bin saif</div>
          <div className="footer-links">
            <a href="mailto:ayan.binsaif@uwaterloo.ca" className="nyx-link">email</a>
            <a href="https://github.com/draggle" target="_blank" rel="noopener noreferrer" className="nyx-link">github</a>
            <a href="https://linkedin.com/in/stitches" target="_blank" rel="noopener noreferrer" className="nyx-link">linkedin</a>
            <a href="/contact" className="nyx-link">contact →</a>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-copy">© 2026 ayan · built with love and late nights</div>
        </div>
      </footer>
    </PaintZone>
  )
}
