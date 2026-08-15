import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-name">Ayan Bin Saif</Link>
      <Link href="/experience">Experience</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/writing">Writing</Link>
      <DarkModeToggle />
    </nav>
  )
}
