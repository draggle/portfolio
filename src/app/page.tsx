import { LinkPreview } from '@/components/ui/link-preview'
import { LinkedInBadgePreview } from '@/components/ui/linkedin-badge-preview'

export default function HomePage() {
  return (
    <div className="page">
      <h1>Ayan Bin Saif</h1>
      {/* .para divs, not <p>: LinkPreview's hover popup renders a <div>, invalid inside <p> */}
      <div className="para">
        I&apos;m studying{' '}
        <LinkPreview
          url="https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing"
          isStatic
          imageSrc="/previews/uwaterloo-program.png"
        >
          Applied Mathematics with Scientific Computing and Scientific Machine Learning
        </LinkPreview>{' '}
        at the{' '}
        <LinkPreview url="https://uwaterloo.ca" isStatic imageSrc="/previews/uwaterloo.png">
          University of Waterloo
        </LinkPreview>
        , and currently engineering at{' '}
        <LinkPreview url="https://tern.ai" isStatic imageSrc="/previews/tern.png">
          Tern
        </LinkPreview>
        . I&apos;m interested in software engineering, data science, full-stack development, and
        mobile engineering.
      </div>
      <div className="para">
        You can reach me by <a href="mailto:ayan.binsaif@uwaterloo.ca">email</a>, find me on{' '}
        <LinkPreview url="https://github.com/draggle" isStatic imageSrc="/previews/github.png">
          GitHub
        </LinkPreview>{' '}
        and <LinkedInBadgePreview>LinkedIn</LinkedInBadgePreview>, or read my{' '}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a>.
      </div>
    </div>
  )
}
