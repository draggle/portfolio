import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-name">Ayan Bin Saif</Link>
      <Link href="/experience">Experience</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/writing">Writing</Link>
      <ThemeToggle className="ml-auto self-center" />
    </nav>
  )
}
