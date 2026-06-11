export interface Experience {
  id: 'tern' | 'apple' | 'uwaterloo'
  company: string
  role: string
  dateRange: string
  isCurrent: boolean
  description: string
  logoColor: string
  link?: string
  linkLabel?: string
}

export const experiences: Experience[] = [
  {
    id: 'tern',
    company: 'tern',
    role: 'engineering intern',
    dateRange: 'may 2026 → present',
    isCurrent: true,
    description:
      'Engineering idps™, an ai-powered positioning stack that keeps navigation accurate without relying on gps, gnss, or cellular signals.',
    logoColor: '#0ea5e9',
    link: 'https://tern.ai',
    linkLabel: 'tern.ai ↗',
  },
  {
    id: 'apple',
    company: 'apple',
    role: 'ios app developer · mentorship',
    dateRange: 'feb 2024 → jul 2024',
    isCurrent: false,
    description:
      'Built native iOS features in Swift and SwiftUI. Architected EduBuddy with a personalized recommendation engine and HIG-aligned UX. Selected for showcase among 200+ participants.',
    logoColor: '#555555',
    link: 'https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf',
    linkLabel: 'view recommendation letter ↗',
  },
  {
    id: 'uwaterloo',
    company: 'university of waterloo',
    role: 'hon. mathematics (co-op)',
    dateRange: '2024 → present',
    isCurrent: true,
    description:
      'Applied mathematics with scientific computing and scientific machine learning. Building strong foundations in DSA, discrete math, and computational theory. Seeking co-op for winter 2027.',
    logoColor: '#f59e0b',
  },
]
