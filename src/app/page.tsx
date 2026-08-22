import Image from 'next/image'
import { GradientText } from '@/components/ui/gradient-text'
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
          <GradientText
            /* plain inline, not the component's inline-flex: keeps the phrase on the
               paragraph baseline, lets it wrap, and lets the <a>'s own underline through. */
            className="inline bg-[var(--bg)] dark:bg-[var(--bg)]"
          >
            University of Waterloo
          </GradientText>
        </LinkPreview>
        <Image className="inline-logo" src="/logos/uwaterloo.svg" alt="" width={32} height={32} />
        , and currently engineering at{' '}
        <LinkPreview url="https://tern.ai" isStatic imageSrc="/previews/tern.png">
          TERN
        </LinkPreview>
        <Image className="inline-logo" src="/logos/tern.png" alt="" width={32} height={32} />
        . I&apos;m passionate about all things software and ML!
      </div>
      <div className="para">
        Outside of work I play piano, guitar, and flute, all self-taught &mdash; piano since I was
        ten. The rest of my free time goes to playing video games, watching anime, and listening to  
        music. I also enjoy napping!
      </div>
      <div className="para">
        You can reach me by <a href="mailto:ayan.binsaif@uwaterloo.ca">email</a>, find me on{' '}
        <LinkPreview url="https://github.com/draggle" isStatic imageSrc="/previews/github.png">
          GitHub
        </LinkPreview>{' '}
        and <LinkedInBadgePreview>LinkedIn</LinkedInBadgePreview>, or read my{' '}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a>.
      </div>
      <video
        className="home-video"
        src="/hillclimbascii.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
    </div>
  )
}
