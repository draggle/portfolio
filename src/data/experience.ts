export interface Experience {
  id: 'tern' | 'apple' | 'uwaterloo'
  company: string
  role: string
  dateRange: string
  isCurrent: boolean
  description: string
  cardDescription?: string
  location?: string
  highlights?: string[]
  tags?: string[]
  logoColor: string
  logoUrl?: string
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
    location: 'Austin, Texas, United States',
    cardDescription: 'building the future of positioning through resilient, satellite-free navigation.',
    description:
      'Engineering idps™, an ai-powered positioning stack that keeps navigation accurate without relying on gps, gnss, or cellular signals.',
    tags: ['typescript', 'next.js', 'python', 'ai/ml', 'positioning systems'],
    logoColor: '#0ea5e9',
    logoUrl: '/logos/tern.png',
    link: 'https://tern.ai',
    linkLabel: 'tern.ai ↗',
  },
  {
    id: 'apple',
    company: 'apple',
    role: 'ios app developer',
    dateRange: 'feb 2024 → jul 2024',
    isCurrent: false,
    location: 'Toronto, Ontario, Canada',
    cardDescription: 'mentorship on ios native apps.',
    description:
      'Built native iOS features in Swift and SwiftUI.',
    highlights: [
      'Built EduBuddy — a personalized iOS productivity app selected for showcase among 200+ participants',
      'Reduced UI load times by 400ms through architectural improvements',
      'Lowered memory usage by 25% via optimized data flow and lazy loading',
      'Architected HIG-aligned UX with SwiftUI, including a personalized recommendation engine',
    ],
    tags: ['swift', 'swiftui', 'xcode', 'ios', 'hig'],
    logoColor: '#555555',
    logoUrl: '/logos/apple.svg',
    link: 'https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf',
    linkLabel: 'view recommendation letter ↗',
  },
  {
    id: 'uwaterloo',
    company: 'university of waterloo',
    role: 'honours bachelor of mathematics',
    dateRange: 'present',
    isCurrent: true,
    location: 'Waterloo, Ontario, Canada',
    cardDescription: 'applied mathematics with scientific computing and scientific machine learning.',
    description:
      'Applied Mathematics with Scientific Computing and Scientific Machine Learning.',
    highlights: [
      'Coursework spanning DSA, linear algebra, discrete math, and computational theory',
      'Seeking winter 2027 co-op opportunities in software engineering',
    ],
    tags: ['applied mathematics', 'scientific computing', 'machine learning', 'co-op'],
    logoColor: '#f59e0b',
    logoUrl: '/logos/uwaterloo.svg',
    link: 'https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing',
    linkLabel: 'view program ↗',
  },
]
