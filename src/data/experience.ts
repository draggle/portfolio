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
  websiteUrl?: string
  websiteLabel?: string
}

export const experiences: Experience[] = [
  {
    id: 'tern',
    company: 'TERN',
    role: 'Engineering Intern',
    dateRange: 'May 2026 → Aug 2026',
    isCurrent: false,
    location: 'Austin, Texas, United States',
    cardDescription: 'Building the future of positioning through resilient, satellite-free navigation.',
    description:
      'First engineering intern — backend infrastructure for IDPS™, an AI-powered, satellite-free positioning stack.',
    highlights: [
      'Engineered a GPS-free cold-start position localization stack: 5.2x more position fixes at 2.6x lower error rate, via scored road-graph matching + persisted position priors, validated on a 251-drive RTK corpus',
      'Rebuilt the offline road-graph builder (OpenStreetMap → matching graphs): byte-identical output across runs and threads (was non-deterministic), 3.8x faster, -53% peak memory',
      'Built the RTK ground-truth evaluation harness used as the ship gate for localization changes — per-drive scoring that surfaced a bug understating baseline accuracy 5x',
      'Developed a magnetometer validation channel that learns per-vehicle compass calibration and vetoes wrong-heading position candidates — catching failures up to 29 km that no other signal could reach',
    ],
    tags: ['TypeScript', 'Next.js', 'Python', 'AI/ML', 'Positioning Systems'],
    logoColor: '#0ea5e9',
    logoUrl: '/logos/tern.png',
    link: 'https://tern.ai',
    linkLabel: 'tern.ai ↗',
  },
  {
    id: 'apple',
    company: 'Apple',
    role: 'iOS App Developer',
    dateRange: 'Feb 2024 → Jul 2024',
    isCurrent: false,
    location: 'Toronto, Ontario, Canada',
    cardDescription: 'Mentorship on iOS native apps.',
    description:
      'Mentorship on iOS native apps. Built native iOS features in Swift and SwiftUI.',
    highlights: [
      'Built EduBuddy — a personalized iOS productivity app selected for showcase among 200+ participants',
      'Reduced UI load times by 400ms through architectural improvements',
      'Lowered memory usage by 25% via optimized data flow and lazy loading',
      'Architected HIG-aligned UX with SwiftUI, including a personalized recommendation engine',
    ],
    tags: ['Swift', 'SwiftUI', 'Xcode', 'iOS', 'HIG'],
    logoColor: '#555555',
    logoUrl: '/logos/apple.svg',
    link: '/recommendation-letter.pdf',
    linkLabel: 'View recommendation letter ↗',
    websiteUrl: 'https://www.apple.com',
    websiteLabel: 'apple.com ↗',
  },
  {
    id: 'uwaterloo',
    company: 'University of Waterloo',
    role: 'Honours Bachelor of Mathematics',
    dateRange: 'Present',
    isCurrent: true,
    location: 'Waterloo, Ontario, Canada',
    cardDescription: 'Applied Mathematics with Scientific Computing and Scientific Machine Learning.',
    description:
      'Applied Mathematics with Scientific Computing and Scientific Machine Learning.',
    highlights: [
      'Coursework spanning DSA, linear algebra, discrete math, and computational theory',
      'Seeking winter 2027 co-op opportunities in software engineering',
    ],
    tags: ['Applied Mathematics', 'Scientific Computing', 'Machine Learning', 'Co-op'],
    logoColor: '#f59e0b',
    logoUrl: '/logos/uwaterloo.svg',
    link: 'https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing',
    linkLabel: 'View program ↗',
  },
]
