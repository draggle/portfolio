import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'

interface NavProps {
  onTerminalOpen: () => void
}

export default function Nav({ onTerminalOpen }: NavProps) {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-logo">ayan bin saif</Link>
      <div className="nav-links">
        <a href="/#about">about</a>
        <a href="/#experience">experience</a>
        <Link href="/projects">projects</Link>
        <a href="/#contact">contact</a>
        <button className="term-btn" onClick={onTerminalOpen}>⌘K terminal</button>
        <DarkModeToggle />
      </div>
    </nav>
  )
}
