'use client'
import {
  useCallback, useEffect, useRef, useState,
} from 'react'

// ── FILE SYSTEM ────────────────────────────────────────────────────────────────
type FSFile = { type: 'file'; content: string }
type FSDir  = { type: 'dir'; hidden?: boolean; contents: Record<string, FSFile | FSDir> }
type FSNode = FSFile | FSDir

const FS: FSDir = {
  type: 'dir',
  contents: {
    'about.txt': { type: 'file', content: 'Applied Math + Computing + ML student at UWaterloo\nInterested in: Software Engineering, Data Science/Engineering, Full-stack Development\nSeeking co-op opportunities for Winter 2027' },
    projects: {
      type: 'dir', contents: {
        'alphahedge.md': { type: 'file', content: '# AlphaHedge — AI Investment Research Platform (YC Hackathon)\n\nOrchestrates a parallel multi-agent council to simulate institutional-grade equity research in under 2 minutes.\n\nStack: Next.js · TypeScript · Supabase · Google Gemini · Sim.ai\nGitHub: https://github.com/draggle/AlphaHedge' },
        'rate-my-rez.md': { type: 'file', content: '# Rate My Rez — Full-Stack Housing Platform\n\n10,000+ unique users in under 30 days.\n\nStack: React · Firebase · Tailwind CSS\nDemo: https://rate-my-rez-waterloo.vercel.app/' },
        'cheeto-fingers.md': { type: 'file', content: '# Cheeto-Fingers — Computer Vision Gesture Controller\n\n21-point 3D hand landmarking at sub-30ms latency.\n\nStack: Python · OpenCV · MediaPipe\nGitHub: https://github.com/draggle/Cheeto-Fingers' },
        'dice-duel.md': { type: 'file', content: '# Dice Duel Showdown — Cross-Platform Strategy Game\n\nProbability-based AI opponent across Web, Python, and Java.\n\nGitHub: https://github.com/draggle/dice-duel-showdown' },
        'edubuddy.md': { type: 'file', content: '# EduBuddy — iOS Productivity Ecosystem (Apple Mentorship)\n\nSelected for showcase among 200+ participants. 400ms UI load reduction.\n\nStack: Swift · SwiftUI · Xcode' },
      },
    },
    experience: {
      type: 'dir', contents: {
        'tern.txt': { type: 'file', content: 'Engineering Intern | May 2026 - Present\n\nEngineering IDPS™, an AI-powered positioning system.\nhttps://tern.ai' },
        'apple.txt': { type: 'file', content: 'iOS App Developer (Mentorship) | Feb 2024 - Jul 2024\n\nBuilt native iOS features in Swift/SwiftUI.\nReduced UI load times by 400ms, memory usage by 25%.\nSelected for showcase among 200+ participants.\n\nRecommendation: https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf' },
        'uwaterloo.txt': { type: 'file', content: 'Applied Math + Computing + ML Student (Co-op) | 2024 - Present\n\nSeeking co-op for Winter 2027.\nResume: https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf' },
      },
    },
    'skills.txt': { type: 'file', content: 'Languages: Python, C, C++, TypeScript, JavaScript, Swift, Bash, Java, Racket, SQL, HTML/CSS\nFrameworks: Next.js, React, React Native, SwiftUI, Node.js, Tailwind CSS, OpenCV, MediaPipe\nTools: Docker, Supabase, PostgreSQL, Firebase, Git, Unix/Linux, Xcode, Vercel, Figma\nConcepts: DSA, RESTful API, Multi-Agent Systems, OOP, UI/UX Design, HCI' },
    contact: {
      type: 'dir', contents: {
        'email.txt': { type: 'file', content: 'ayan.binsaif@uwaterloo.ca' },
        'github.txt': { type: 'file', content: 'github.com/draggle' },
        'linkedin.txt': { type: 'file', content: 'linkedin.com/in/stitches' },
        'location.txt': { type: 'file', content: 'Waterloo, Ontario, Canada' },
      },
    },
    documents: {
      type: 'dir', contents: {
        'resume.pdf': { type: 'file', content: 'To open: open resume\nLink: https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf' },
        'recommendation-letter.pdf': { type: 'file', content: 'To open: open recommendation\nLink: https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf' },
      },
    },
    '.secrets': {
      type: 'dir', hidden: true, contents: {
        'secret.txt': { type: 'file', content: "Wow! You know your way around a terminal! 🎉\n\nIf you're reading this, you know Unix commands.\n\n- Ayan\n\nP.S. Try: theme dark / theme light" },
      },
    },
  },
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function getNodeAtPath(path: string): FSNode | null {
  if (path === '/') return FS
  const parts = path.split('/').filter(Boolean)
  let cur: FSNode = FS
  for (const part of parts) {
    if (cur.type !== 'dir' || !cur.contents[part]) return null
    cur = cur.contents[part]
  }
  return cur
}

function resolvePath(current: string, input: string): string {
  if (input === '/') return '/'
  if (input.startsWith('/')) return input
  const parts = current.split('/').filter(Boolean)
  for (const seg of input.split('/').filter(Boolean)) {
    if (seg === '..') parts.pop()
    else if (seg !== '.') parts.push(seg)
  }
  return '/' + parts.join('/')
}

function lcp(arr: string[]): string {
  if (!arr.length) return ''
  return arr.reduce((p, s) => { while (!s.startsWith(p)) p = p.slice(0, -1); return p })
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────
interface TerminalProps {
  isOpen: boolean
  onClose: () => void
}

interface Line { html: string; className?: string }

const isMac = typeof navigator !== 'undefined'
  ? /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
  : false
const MOD = isMac ? 'Cmd' : 'Ctrl'

const WELCOME: Line[] = [
  { html: '<span class="t-green">Welcome to Ayan\'s Portfolio Terminal v2.0</span>' },
  { html: '<span class="t-cyan">Type \'help\' for available commands</span>' },
  { html: '<span style="color:#ffbd2e">🥚 Can you find the hidden easter egg? Read \'help\' carefully...</span>' },
  { html: '' },
]

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [path, setPath] = useState('/')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [hint, setHint] = useState('')

  const bodyRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const prompt = useCallback(() =>
    `<span class="t-green">ayan@portfolio</span>:<span class="t-cyan">${path}</span>$ `,
  [path])

  const addLine = useCallback((html: string, className?: string) => {
    setLines(prev => [...prev, { html, className }])
  }, [])

  const handleCommand = useCallback((raw: string) => {
    const input = raw.trim()
    setHistory(h => [...h, input])
    setHistIdx(-1)
    addLine(prompt() + input)

    const parts = input.split(/\s+/)
    const cmd   = parts[0].toLowerCase()
    const args  = parts.slice(1)

    switch (cmd) {
      case '': break

      case 'help':
        addLine(`
<span class="t-green">Available Commands:</span><br>
<span class="t-cyan">ls</span> [dir] [-a] — list directory contents<br>
<span class="t-cyan">cd</span> &lt;dir&gt; — change directory<br>
<span class="t-cyan">cat</span> &lt;file&gt; — display file contents<br>
<span class="t-cyan">pwd</span> — print working directory<br>
<span class="t-cyan">clear</span> — clear terminal<br>
<span class="t-cyan">open</span> &lt;target&gt; — open links (github, linkedin, email, tern, alphahedge, alphahedge-demo, rate-my-rez, rate-my-rez-demo, cheeto-fingers, dice-duel, resume, recommendation)<br>
<span class="t-cyan">theme</span> &lt;light|dark&gt; — toggle site theme<br>
<span class="t-cyan">whoami</span> — display profile<br>
<span class="t-cyan">about</span> / <span class="t-cyan">projects</span> / <span class="t-cyan">contact</span> — navigate sections<br>
<br>
<span class="t-green">Tips:</span> Tab for autocomplete · ↑↓ for history · ESC or ${MOD}+K to close`)
        break

      case 'pwd':
        addLine(path)
        break

      case 'clear':
        setLines([])
        break

      case 'ls': {
        const showHidden = args.includes('-a')
        const dirArg = args.find(a => !a.startsWith('-'))
        const target = dirArg ? resolvePath(path, dirArg) : path
        const node = getNodeAtPath(target)
        if (!node) { addLine(`ls: ${dirArg}: No such file or directory`, 't-red'); break }
        if (node.type !== 'dir') { addLine(`ls: ${dirArg}: Not a directory`, 't-red'); break }
        const items = Object.entries(node.contents)
          .filter(([name]) => showHidden || !name.startsWith('.'))
          .map(([name, n]) => n.type === 'dir'
            ? `<span class="t-cyan">${name}/</span>`
            : `<span class="t-white">${name}</span>`)
        addLine(items.join('  ') || '(empty)')
        break
      }

      case 'cd': {
        const dest = args[0] ?? '/'
        const target = resolvePath(path, dest)
        const node = getNodeAtPath(target)
        if (!node) { addLine(`cd: ${dest}: No such directory`, 't-red'); break }
        if (node.type !== 'dir') { addLine(`cd: ${dest}: Not a directory`, 't-red'); break }
        setPath(target)
        break
      }

      case 'cat': {
        if (!args[0]) { addLine('cat: missing file operand', 't-red'); break }
        const target = resolvePath(path, args[0])
        const node = getNodeAtPath(target)
        if (!node) { addLine(`cat: ${args[0]}: No such file`, 't-red'); break }
        if (node.type === 'dir') { addLine(`cat: ${args[0]}: Is a directory`, 't-red'); break }
        const highlighted = node.content
          .replace(/^(# .+)$/gm, '<span class="t-cyan">$1</span>')
          .replace(/\n/g, '<br>')
        addLine(highlighted)
        break
      }

      case 'open': {
        if (!args[0]) { addLine('Usage: open [github|linkedin|email|tern|alphahedge|alphahedge-demo|rate-my-rez|rate-my-rez-demo|cheeto-fingers|dice-duel|resume|recommendation]', 't-red'); break }
        const t = args[0].toLowerCase()
        const urls: Record<string, string | (() => void)> = {
          github:           'https://github.com/draggle',
          linkedin:         'https://linkedin.com/in/stitches',
          email:            () => { window.location.href = 'mailto:ayan.binsaif@uwaterloo.ca' },
          tern:             'https://tern.ai',
          alphahedge:       'https://github.com/draggle/AlphaHedge',
          'alphahedge-demo':'https://www.youtube.com/watch?v=zKdAAbf10yw',
          'rate-my-rez':    'https://github.com/draggle/rate-my-rez-waterloo',
          'rate-my-rez-demo':'https://rate-my-rez-waterloo.vercel.app/',
          'cheeto-fingers': 'https://github.com/draggle/Cheeto-Fingers',
          'dice-duel':      'https://github.com/draggle/dice-duel-showdown',
          resume:           'https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf',
          recommendation:   'https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf',
        }
        if (!(t in urls)) { addLine(`Unknown target: ${t}`, 't-red'); break }
        addLine(`Opening ${t}...`, 't-green')
        setTimeout(() => {
          const action = urls[t]
          if (typeof action === 'function') action()
          else window.open(action, '_blank')
        }, 300)
        break
      }

      case 'theme': {
        const mode = args[0]?.toLowerCase()
        if (mode !== 'light' && mode !== 'dark') {
          addLine('Usage: theme &lt;light|dark&gt;', 't-red'); break
        }
        document.documentElement.classList.toggle('dark', mode === 'dark')
        localStorage.setItem('theme', mode)
        addLine(`Theme set to <span class="t-green">${mode}</span>`)
        break
      }

      case 'whoami': {
        addLine(`<span class="t-green">ayan</span><span class="t-dim">@</span><span class="t-cyan">portfolio</span><br>
<span class="t-dim">─────────────────────────────</span><br>
<span class="t-cyan">name    </span>ayan bin saif<br>
<span class="t-cyan">school  </span>univ. of waterloo<br>
<span class="t-cyan">program </span>hon. mathematics (co-op)<br>
<span class="t-cyan">intern  </span><a href="https://tern.ai" target="_blank" style="color:#28ca42">tern · engineering intern</a><br>
<span class="t-cyan">status  </span><span class="t-green">open → winter 2027 co-op</span><br>
<span class="t-dim">─────────────────────────────</span><br>
<span class="t-cyan">langs   </span>python · typescript · swift · java · c<br>
<span class="t-cyan">stack   </span>next.js · react · supabase · firebase<br>
<span class="t-cyan">tools   </span>docker · git · linux · xcode · figma<br>
<span class="t-dim">─────────────────────────────</span><br>
<span class="t-cyan">github  </span><a href="https://github.com/draggle" target="_blank" style="color:#28ca42">github.com/draggle</a><br>
<span class="t-cyan">linkedin</span><a href="https://linkedin.com/in/stitches" target="_blank" style="color:#28ca42">linkedin.com/in/stitches</a><br>
<span class="t-cyan">email   </span><a href="mailto:ayan.binsaif@uwaterloo.ca" style="color:#28ca42">ayan.binsaif@uwaterloo.ca</a>`)
        break
      }

      case 'about':
        onClose(); window.location.hash = 'about'
        addLine('Navigating to about...', 't-green')
        break
      case 'projects':
        onClose(); window.location.hash = 'projects'
        addLine('Navigating to projects...', 't-green')
        break
      case 'contact':
        onClose(); window.location.hash = 'contact'
        addLine('Navigating to contact...', 't-green')
        break

      default:
        addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 't-red')
    }
  }, [path, prompt, addLine, onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Tab') setHint('')

    if (e.key === 'Enter') {
      const val = e.currentTarget.value
      e.currentTarget.value = ''
      if (val.trim()) handleCommand(val)
      else addLine(prompt())
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistory(h => {
        const idx = Math.max(0, histIdx < 0 ? h.length - 1 : histIdx - 1)
        setHistIdx(idx)
        if (inputRef.current) inputRef.current.value = h[idx] ?? ''
        return h
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(-1)
        if (inputRef.current) inputRef.current.value = ''
      } else {
        setHistIdx(next)
        if (inputRef.current) inputRef.current.value = history[next]
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const val  = e.currentTarget.value
      const parts = val.split(/\s+/)
      const cmd0 = parts[0].toLowerCase()

      if (parts.length === 1) {
        const cmds = ['help','ls','cd','cat','pwd','clear','open','theme','whoami','about','projects','contact']
        const matches = cmds.filter(c => c.startsWith(cmd0))
        if (!matches.length) return
        const completed = lcp(matches)
        if (completed.length > cmd0.length) e.currentTarget.value = completed
        else if (matches.length > 1) setHint('[' + matches.join('  ') + ']')
        return
      }

      const argPartial = parts[parts.length - 1]
      const prefix = parts.slice(0, -1).join(' ') + ' '

      if (cmd0 === 'open') {
        const targets = ['github','linkedin','email','tern','alphahedge','alphahedge-demo','rate-my-rez','rate-my-rez-demo','cheeto-fingers','dice-duel','resume','recommendation']
        const matches = targets.filter(t => t.startsWith(argPartial))
        if (!matches.length) return
        const completed = lcp(matches)
        if (completed.length > argPartial.length) e.currentTarget.value = prefix + completed
        else if (matches.length > 1) setHint('[' + matches.join('  ') + ']')
        return
      }

      if (['cat','cd','ls'].includes(cmd0)) {
        const lastSlash = argPartial.lastIndexOf('/')
        const dirPart  = lastSlash >= 0 ? argPartial.slice(0, lastSlash + 1) : ''
        const filePart = lastSlash >= 0 ? argPartial.slice(lastSlash + 1) : argPartial
        const searchPath = resolvePath(path, dirPart || '.')
        const node = getNodeAtPath(searchPath)
        if (!node || node.type !== 'dir') return
        const matches = Object.keys(node.contents).filter(n => n.toLowerCase().startsWith(filePart.toLowerCase()))
        if (!matches.length) return
        const completed = lcp(matches)
        if (completed.length > filePart.length) e.currentTarget.value = prefix + dirPart + completed
        else if (matches.length > 1) setHint('[' + matches.map(n => (node as FSDir).contents[n].type === 'dir' ? n + '/' : n).join('  ') + ']')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="terminal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="terminal-box">
        <div className="terminal-titlebar">
          <div className="t-dot red" onClick={onClose} />
          <div className="t-dot yellow" />
          <div className="t-dot green" />
          <div className="terminal-title">ayan@portfolio:~</div>
        </div>
        <div className="terminal-body" ref={bodyRef}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`terminal-line${line.className ? ' ' + line.className : ''}`}
              dangerouslySetInnerHTML={{ __html: line.html }}
            />
          ))}
          <div className="terminal-input-line">
            <span dangerouslySetInnerHTML={{ __html: prompt() }} />
            <input
              ref={inputRef}
              className="terminal-input"
              autoComplete="off"
              spellCheck={false}
              onKeyDown={handleKeyDown}
            />
            <span className="t-hint">{hint}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
