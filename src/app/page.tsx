import PaintZone from '@/components/PaintZone'
import LocationWidget from '@/components/LocationWidget'
import ExperienceSection from '@/components/ExperienceSection'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
import { LinkPreview } from '@/components/ui/link-preview'
import { LinkedInBadgePreview } from '@/components/ui/linkedin-badge-preview'
import { AnimatedText } from '@/components/ui/animated-underline-text-one'

export default function HomePage() {
  const featured = projects.filter(p => p.featured)

  return (
    <PaintZone>
      <section id="about" className="hero">
        <AnimatedText
          text="ayan bin saif"
          className="hero-name-wrapper"
          textClassName="hero-name"
          underlineClassName="hero-name-underline"
        />
        <div className="hero-bio">
          i'm currently studying{' '}
          <LinkPreview
            url="https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing"
            className="nyx-link"
            isStatic
            imageSrc="/previews/uwaterloo-program.png"
          >
            applied mathematics with scientific computing and scientific machine learning ↗
          </LinkPreview>{' '}
          at the{' '}
          <LinkPreview url="https://uwaterloo.ca" className="nyx-link" isStatic imageSrc="/previews/uwaterloo.png">
            <strong>university of waterloo ↗</strong>
          </LinkPreview>
          <br /><br />
          i'm currently engineering at{' '}
          <LinkPreview url="https://tern.ai" className="nyx-link" isStatic imageSrc="/previews/tern.png">
            tern ↗
          </LinkPreview>
          . i'm interested in software engineering, data science, full-stack development, and mobile
          engineering.
        </div>
        <div className="hero-links">
          <a href="mailto:ayan.binsaif@uwaterloo.ca" className="nyx-link">email ↗</a>
          <span className="sep">·</span>
          <LinkPreview url="https://github.com/draggle" className="nyx-link" isStatic imageSrc="/previews/github.png">github ↗</LinkPreview>
          <span className="sep">·</span>
          <LinkedInBadgePreview className="nyx-link">linkedin ↗</LinkedInBadgePreview>
          <span className="sep">·</span>
          <a
            href="/resume.pdf"
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
        <div className="footer-inner">
          <div>
            <div className="footer-name">ayan bin saif</div>
            <div className="footer-links">
              <a href="mailto:ayan.binsaif@uwaterloo.ca" className="nyx-link">email →</a>
              <LinkPreview url="https://github.com/draggle" className="nyx-link" isStatic imageSrc="/previews/github.png">github →</LinkPreview>
              <LinkedInBadgePreview className="nyx-link">linkedin →</LinkedInBadgePreview>
              <a href="/contact" className="nyx-link">contact →</a>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-copy">© 2026 ayan · built with love and late nights</div>
          </div>
        </div>
      </footer>
    </PaintZone>
  )
}
