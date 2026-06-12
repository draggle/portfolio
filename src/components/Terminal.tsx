'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { modShortcut, useIsMacOS } from '@/lib/platform'

// ── TYPES ──────────────────────────────────────────────────────────────────
interface HistEntry { id: number; command: string; output: string }
type CmdFn = (args: string[]) => Promise<string> | string
interface Cmd { fn: CmdFn; desc: string; hidden?: true }

// ── NORD COLORS ────────────────────────────────────────────────────────────
const N = {
  green: '#A3BE8C',
  blue:  '#5E81AC',
  gray:  '#88C0D0',
  gold:  '#EBCB8B',
  red:   '#BF616A',
  fg:    '#E5E9F0',
  bg:    '#2E3440',
}

// ── HELPERS ────────────────────────────────────────────────────────────────
const a = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:${N.gold};text-decoration:underline">${text}</a>`

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

// ── BANNER ─────────────────────────────────────────────────────────────────
const BANNER = `<span style="color:${N.green};display:block;white-space:pre;min-width:max-content;line-height:1.2"> █████╗ ██╗   ██╗ █████╗ ███╗   ██╗
██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║
███████║ ╚████╔╝ ███████║██╔██╗ ██║
██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║
██║  ██║   ██║   ██║  ██║██║ ╚████║
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝

██████╗ ██╗███╗   ██╗    ███████╗ █████╗ ██╗███████╗
██╔══██╗██║████╗  ██║    ██╔════╝██╔══██╗██║██╔════╝
██████╔╝██║██╔██╗ ██║    ███████╗███████║██║█████╗
██╔══██╗██║██║╚██╗██║    ╚════██║██╔══██║██║██╔══╝
██████╔╝██║██║ ╚████║    ███████║██║  ██║██║██║
╚═════╝ ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═╝╚═╝╚═╝</span>

Type <span style="color:${N.gold}">'help'</span> for available commands.
Type <span style="color:${N.gold}">'sumfetch'</span> for a quick summary.
Press <span style="color:${N.gray}">ESC</span> or type <span style="color:${N.gold}">'portfolio'</span> to return to the portfolio.`

// ── COMMANDS ───────────────────────────────────────────────────────────────
function buildHelpText(cmds: Record<string, Cmd>, clearShortcut: string) {
  const visible = Object.entries(cmds)
    .filter(([, c]) => !c.hidden)
    .sort(([a], [b]) => a.localeCompare(b))
  const max = Math.max(...visible.map(([k]) => k.length))
  const rows = visible.map(([k, c]) =>
    `${k}${' '.repeat(max - k.length + 4)}${c.desc}`
  ).join('\n')
  return `available commands:\n\n${rows}\n\n[tab]: autocomplete  ·  [↑↓]: history  ·  [${clearShortcut}] / clear: clear terminal`
}

const CMDS: Record<string, Cmd> = {
  help: {
    desc: 'Display this help message.',
    fn: () => '', // replaced at runtime with platform-aware text
  },

  about: {
    desc: 'Display information about me.',
    fn: () =>
      `hi, i'm ayan bin saif.\n\napplied mathematics with scientific computing &amp; ml student at the university of waterloo.\ncurrently engineering at ${a('https://tern.ai', 'tern.ai')} — building idps™, an ai-powered positioning stack.\n\ninterested in software engineering, data science, full-stack development, and mobile engineering.\nseeking co-op opportunities for winter 2027.\n\ntype 'sumfetch' for a quick summary.\ntype 'projects' to see what i've built.\ntype 'experience' for my work history.`,
  },

  banner: {
    desc: 'Display the welcome banner.',
    fn: () => BANNER,
  },

  sumfetch: {
    desc: 'Display a summary of my info.',
    fn: () =>
`╭──────────────────────╮     <span style="color:${N.gold}">sumfetch</span>
│ <span style="color:${N.red}">●</span> <span style="color:${N.gold}">●</span> <span style="color:${N.green}">●</span>                │     ─────────────────────────────
├──────────────────────┤     <span style="color:${N.gray}">NAME</span>     ayan bin saif
│                      │     <span style="color:${N.gray}">SCHOOL</span>   university of waterloo
│  <span style="color:${N.blue}">ayan</span><span style="color:${N.gray}">@</span><span style="color:${N.green}">portfolio</span> ~    │     <span style="color:${N.gray}">PROGRAM</span>  amath + computing + ml
│  <span style="color:${N.gold}">$</span> whoami            │     <span style="color:${N.gray}">CURRENT</span>  ${a('https://tern.ai', 'tern.ai')} · engineering intern
│  ayan bin saif       │     <span style="color:${N.gray}">STATUS</span>   open → winter 2027 co-op
│  <span style="color:${N.gold}">$</span> _                 │     ─────────────────────────────
│                      │     <span style="color:${N.gray}">CONNECT</span>
╰──────────────────────╯     ${a('mailto:ayan.binsaif@uwaterloo.ca', 'ayan.binsaif@uwaterloo.ca')}
                              ${a('https://github.com/draggle', 'github.com/draggle')}
                              ${a('https://linkedin.com/in/stitches', 'linkedin.com/in/stitches')}
                             ─────────────────────────────
                             <span style="color:${N.gray}">RESUME</span>   ${a('https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf', 'download pdf')}`,
  },

  projects: {
    desc: 'List my projects.',
    fn: () =>
`<span style="color:${N.gold}">alphahedge</span>   ${a('https://github.com/draggle/AlphaHedge', 'github.com/draggle/AlphaHedge')}
  ai investment research platform · multi-agent council · next.js · supabase · gemini

<span style="color:${N.gold}">rate-my-rez</span>  ${a('https://rate-my-rez-waterloo.vercel.app/', 'rate-my-rez-waterloo.vercel.app')}
  full-stack housing platform · 10k+ users in 30 days · react · firebase

<span style="color:${N.gold}">cheeto-fingers</span>  ${a('https://github.com/draggle/Cheeto-Fingers', 'github.com/draggle/Cheeto-Fingers')}
  computer vision gesture controller · 21-point hand tracking at &lt;30ms · python · opencv

<span style="color:${N.gold}">dice-duel</span>  ${a('https://github.com/draggle/dice-duel-showdown', 'github.com/draggle/dice-duel-showdown')}
  cross-platform strategy game · probability-based ai · web + python + java

<span style="color:${N.gold}">edubuddy</span>
  ios productivity app · apple mentorship · showcase pick among 200+ · swift · swiftui`,
  },

  experience: {
    desc: 'List my work experience.',
    fn: () =>
`<span style="color:${N.gold}">tern</span>  ${a('https://tern.ai', 'tern.ai')}  ·  engineering intern  ·  may 2026 – present
  engineering idps™, an ai-powered indoor positioning stack that keeps navigation accurate without gps

<span style="color:${N.gold}">apple</span>  ·  ios app developer (mentorship)  ·  feb 2024 – jul 2024
  built native ios features in swift/swiftui · 400ms ui load reduction · 25% memory usage drop
  selected for showcase among 200+ participants
  ${a('https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf', 'letter of recommendation')}

<span style="color:${N.gold}">university of waterloo</span>  ·  student  ·  present
  amath + computing + scientific machine learning`,
  },

  resume: {
    desc: 'Open my resume in your browser.',
    fn: () => {
      window.open('https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf')
      return 'opening resume...'
    },
  },

  email: {
    desc: 'Send me an email.',
    fn: () => {
      window.location.href = 'mailto:ayan.binsaif@uwaterloo.ca'
      return 'opening mailto:ayan.binsaif@uwaterloo.ca...'
    },
  },

  github: {
    desc: 'Open my GitHub profile.',
    fn: () => { window.open('https://github.com/draggle'); return 'opening github.com/draggle...' },
  },

  linkedin: {
    desc: 'Open my LinkedIn profile.',
    fn: () => { window.open('https://linkedin.com/in/stitches'); return 'opening linkedin.com/in/stitches...' },
  },

  portfolio: {
    desc: 'Go to my portfolio.',
    fn: () => '__nav:/',
  },

  theme: {
    desc: 'Toggle site theme. Usage: theme <light|dark>',
    fn: (args) => {
      const mode = args[0]?.toLowerCase()
      if (mode !== 'light' && mode !== 'dark') return 'usage: theme &lt;light|dark&gt;'
      document.documentElement.classList.toggle('dark', mode === 'dark')
      localStorage.setItem('theme', mode)
      return `theme set to ${mode}`
    },
  },

  google: {
    desc: 'Search Google. Usage: google [query]',
    fn: (args) => {
      if (!args.length) return 'usage: google [query]'
      window.open(`https://google.com/search?q=${encodeURIComponent(args.join(' '))}`)
      return `searching google for "${args.join(' ')}"...`
    },
  },

  bing: {
    desc: 'Search Bing... (seriously?)',
    fn: (args) => {
      if (!args.length) return 'usage: bing [query]'
      window.open(`https://bing.com/search?q=${encodeURIComponent(args.join(' '))}`)
      return `wow, really? searching bing for "${args.join(' ')}"?`
    },
  },

  echo: {
    desc: 'Print a string. Usage: echo [string]',
    fn: (args) => {
      if (!args.length) return 'usage: echo [string]'
      const s = args.join(' ')
      if (/<script|<iframe|javascript:/i.test(s)) return 'nice try lmao'
      return esc(s)
    },
  },

  date: {
    desc: 'Print the current date and time.',
    fn: () => new Date().toString(),
  },

  pwd: { desc: 'Print the current working directory.', fn: () => '/home/ayan/' },

  ls: {
    desc: 'List files.',
    fn: () => `.env  Dockerfile  secrets.txt  CuteCatVideos/`,
  },

  cd: {
    desc: 'Change directory.',
    fn: () => `unfortunately, i cannot afford more directories.`,
  },

  cat: {
    desc: 'Concatenate and display... or maybe just a cat.',
    fn: () => {
      const cats = [
`   /\\_/\\
  ( o.o )
   > ^ <`,
`    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  (           )

meow!`,
`  |\\__/,|   (\`\\
_.|o o  |_   ) )
-(((---(((--------`,
      ]
      return `<pre>${cats[Math.floor(Math.random() * cats.length)]}</pre>`
    },
  },

  whoami: { desc: 'Print the current user.', fn: () => 'guest' },

  clear: { desc: 'Clear the terminal.', fn: () => '__clear' },

  vi:    { desc: 'Open vi.',     fn: () => `woah, you still use 'vi'? just try 'vim'.` },
  vim:   { desc: 'Open vim.',    fn: () => `'vim' is so outdated. how about 'nvim'?` },
  nvim:  { desc: 'Open nvim.',   fn: () => `'nvim'? too fancy. why not 'emacs'?` },
  emacs: { desc: 'Open emacs.',  fn: () => `you know what? just use nano.` },
  nano:  { desc: 'Open nano.',   fn: () => `at this point, just use vscode.` },
  code:  { desc: 'Open VSCode.', fn: () => `never gonna give you up, never gonna let you down...` },

  sudo: {
    desc: 'Execute as superuser.',
    fn: () => {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
      return `Permission denied: with little power comes... no responsibility?`
    },
  },
}

// ── SHELL ──────────────────────────────────────────────────────────────────
type NavResult = { nav: string } | null

async function runShell(
  command: string,
  cmds: Record<string, Cmd>,
  addEntry: (cmd: string, out: string) => void,
  clearEntries: () => void,
): Promise<NavResult> {
  const parts = command.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  if (!cmd) { addEntry(command, ''); return null }

  if (!(cmd in cmds)) {
    addEntry(command, `shell: command not found: ${cmd}. Try 'help' to get started.`)
    return null
  }

  const output = await cmds[cmd].fn(args)

  if (output === '__clear') { clearEntries(); return null }
  if (typeof output === 'string' && output.startsWith('__nav:')) {
    return { nav: output.slice(6) }
  }

  addEntry(command, output ?? '')
  return null
}

// ── Ps1 ────────────────────────────────────────────────────────────────────
function Ps1() {
  return (
    <span className="term-ps1">
      <span style={{ color: N.blue }}>ayan</span>
      <span style={{ color: N.gray }}>@</span>
      <span style={{ color: N.green }}>portfolio</span>
      <span style={{ color: N.gray }}>:$ ~ </span>
    </span>
  )
}

// ── TERMINAL ───────────────────────────────────────────────────────────────
interface TerminalProps { onClose?: () => void }

export default function Terminal({ onClose }: TerminalProps = {}) {
  const router = useRouter()
  const close = onClose ?? (() => router.back())
  const isMac = useIsMacOS()
  const clearShortcut = isMac === null ? 'Ctrl+L' : modShortcut('L', isMac)

  const cmds = useMemo(() => ({
    ...CMDS,
    help: {
      ...CMDS.help,
      fn: () => buildHelpText(CMDS, clearShortcut),
    },
  }), [clearShortcut])

  const [history, setHistory] = useState<HistEntry[]>([])
  const [cmdHist, setCmdHist] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(0)
  const [command, setCommand] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setHistory([{ id: 0, command: '', output: BANNER }])
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight)
    }
    inputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const addEntry = (cmd: string, out: string) =>
    setHistory(prev => [...prev, { id: prev.length, command: cmd, output: out }])

  const clearEntries = () => setHistory([])

  // ── Autocomplete ──────────────────────────────────────────────────────────
  const KEYS = useMemo(() => Object.keys(cmds), [cmds])

  const ghostRemainder = useMemo(() => {
    if (!command || command.includes(' ')) return ''
    const lc = command.toLowerCase()
    const match = KEYS.find(k => k !== lc && k.startsWith(lc))
    return match ? match.slice(command.length) : ''
  }, [command, KEYS])

  const hasMatch = useMemo(() => {
    if (!command) return true
    const lc = command.split(' ')[0].toLowerCase()
    return lc in cmds || KEYS.some(k => k.startsWith(lc))
  }, [command, KEYS, cmds])

  const inputColor = !command || hasMatch ? N.green : N.red

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const mod = e.ctrlKey || e.metaKey

    if (e.key === 'c' && mod) {
      e.preventDefault()
      addEntry(command, '')
      setCommand('')
      setHistIdx(0)
      return
    }

    if (e.key === 'l' && mod) {
      e.preventDefault()
      clearEntries()
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (ghostRemainder) setCommand(command + ghostRemainder)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const nav = await runShell(command, cmds, addEntry, clearEntries)
      if (command) setCmdHist(prev => [...prev, command])
      setHistIdx(0)
      setCommand('')
      if (nav) {
        if (nav.nav === 'back') close()
        else router.push(nav.nav)
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!cmdHist.length) return
      const next = Math.min(histIdx + 1, cmdHist.length)
      setHistIdx(next)
      setCommand(cmdHist[cmdHist.length - next] ?? '')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next <= 0) { setHistIdx(0); setCommand('') }
      else { setHistIdx(next); setCommand(cmdHist[cmdHist.length - next] ?? '') }
      return
    }
  }

  return (
    <div className="term-page" onClick={() => inputRef.current?.focus()}>
      <div className="term-frame" ref={containerRef}>
        {history.map(entry => (
          <div key={entry.id} className="term-entry">
            {entry.command && (
              <div className="term-prompt-row">
                <Ps1 />
                <span style={{ color: N.fg }}>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <p className="term-output" dangerouslySetInnerHTML={{ __html: entry.output }} />
            )}
          </div>
        ))}

        <div className="term-prompt-row">
          <label htmlFor="term-input" className="term-ps1-wrap"><Ps1 /></label>
          <div className="term-input-wrap">
            <div className="term-ghost" aria-hidden="true">
              <span style={{ color: inputColor }}>{command}</span>
              <span style={{ color: 'rgba(163,190,140,0.38)' }}>{ghostRemainder}</span>
            </div>
            <input
              ref={inputRef}
              id="term-input"
              type="text"
              className="term-input"
              value={command}
              onChange={e => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ color: inputColor, caretColor: N.gray, background: N.bg }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
