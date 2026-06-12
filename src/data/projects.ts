export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string[]
  tags: string[]
  links: {
    github?: string
    demo?: string
    event?: string
    video?: string
    recommendation?: string
  }
  thumbnail: {
    emoji: string
    gradient: string
    image?: string
  }
  featured: boolean
  builtAt?: string
}

export const projects: Project[] = [
  {
    slug: 'alphahedge',
    title: 'alphahedge',
    shortDescription:
      'AI-powered investment research platform built at the Y Combinator Full-Stack Hackathon. Orchestrates a parallel multi-agent council to simulate institutional-grade equity research in under 2 minutes.',
    description: [
      'Developed an AI-powered investment research platform at the Y Combinator Full-Stack Hackathon. AlphaHedge orchestrates a parallel multi-agent council to simulate institutional-grade equity research workflows in under 2 minutes.',
      'Three autonomous analyst agents are prompted concurrently: a fundamental analyst evaluating 10-Q / 10-K filings, balance sheets, cash flow statements, debt structure, and valuation metrics; a quantitative analyst operating on raw OHLCV data, technical indicators, volatility and beta, factor exposures, and probabilistic risk-adjusted models; and a sentiment analyst synthesizing news and PR flow, social media buzz, analyst ratings and price targets, corporate catalysts, short interest, and narrative trend mapping.',
      "A final judge agent reviews all analyst memos and produces a unified investment recommendation tailored to the user's risk tolerance, time horizon, and portfolio size collected during onboarding. Implemented retrieval-augmented Q&A using Google Gemini and managed real-time persistence with Supabase. Implemented an interactive knowledge layer that parses complex financial terminology into styled tooltips for immediate context.",
    ],
    tags: ['next.js', 'typescript', 'supabase', 'google gemini', 'sim.ai'],
    links: {
      github: 'https://github.com/draggle/AlphaHedge',
      event: 'https://events.ycombinator.com/fullstackhackathon',
      video: 'https://www.youtube.com/watch?v=zKdAAbf10yw',
    },
    thumbnail: { emoji: '📈', gradient: 'linear-gradient(135deg, #0f0f23, #1a1a3e)', image: '/thumbs/alphahedge.png' },
    featured: true,
    builtAt: 'YC Full-Stack Hackathon, hosted by sim.ai & loveable @ Y Combinator, sponsored by Stripe, Brex & Supabase',
  },
  {
    slug: 'rate-my-rez',
    title: 'rate my rez',
    shortDescription:
      'Full-stack housing review platform for the University of Waterloo community, reaching 10,000+ unique visits in under one month of launch.',
    description: [
      'Built and deployed a full-stack housing review platform for the University of Waterloo community using React and Firebase, reaching 10,000+ unique visits in under one month of launch. The application serves as a centralized database for both on-campus residences and off-campus apartments, enabling students to navigate the local housing market through community-driven data and honest reviews.',
      'The platform features a specialized sublet page where students can post and manage housing listings with integrated support for rent details, availability dates, and media uploads. The system utilizes secure serverless CRUD APIs with Firebase authentication and role-based access control to handle user-generated content, property reviews, and threaded community Q&A sessions.',
      'To maintain a responsive user experience during active search sessions, the interface leverages React memoization to reduce UI state recomputation by 60% and ensures sub-100ms update latency via real-time Firestore synchronization. Integrated map functionality and faculty-based filtering allow students to calculate commute times and filter properties by rent, location, and helpfulness metrics.',
    ],
    tags: ['react', 'firebase', 'tailwind css'],
    links: {
      github: 'https://github.com/draggle/rate-my-rez-waterloo',
      demo: 'https://rate-my-rez-waterloo.vercel.app/',
    },
    thumbnail: { emoji: '🏠', gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)', image: '/thumbs/rate-my-rez.png' },
    featured: true,
  },
  {
    slug: 'cheeto-fingers',
    title: 'cheeto-fingers',
    shortDescription:
      'Touchless gesture control system using Python, OpenCV, and MediaPipe to enable hands-free computer interaction via real-time hand tracking.',
    description: [
      'Built a touchless gesture control system using Python, OpenCV, and MediaPipe to enable hands-free computer interaction for scenarios where physical contact with peripherals is impractical. The system utilizes a deep learning pipeline to translate live video feed into real-time OS-level mouse events.',
      "The architecture leverages Google MediaPipe's neural networks to perform 21-point 3D hand landmarking, identifying specific knuckle coordinates at sub-30ms latency. By applying vector math and Euclidean distance calculations, the logic layer maps finger \"pinches\" and palm orientations to standard primary actions: index-thumb pinches for left clicks, ring-finger pinches for right clicks, and middle-finger grabs for precision vertical scrolling.",
      "To ensure precise navigation, the system implements coordinate transformations that map the camera's resolution to the monitor's pixel grid through linear interpolation. A specialized jitter buffer and exponential moving average (EMA) smoothing algorithm were designed to filter raw sensor noise, reducing cursor jitter and maintaining stability during active use.",
    ],
    tags: ['python', 'opencv', 'mediapipe', 'computer vision'],
    links: { github: 'https://github.com/draggle/Cheeto-Fingers' },
    thumbnail: { emoji: '✋', gradient: 'linear-gradient(135deg, #166534, #16a34a)' },
    featured: false,
  },
  {
    slug: 'dice-duel-showdown',
    title: 'dice duel showdown',
    shortDescription:
      'Strategic turn-based dice game with a custom probability-based AI opponent, implemented across web, Python, and Java environments.',
    description: [
      'Developed a strategic, turn-based dice game featuring a custom probability-based AI opponent across web, Python, and Java environments. The core gameplay mechanics challenge users to reach a target score of 50 through risk-mitigation strategies and resource management, with precise victory conditions for hitting the target exactly or avoiding a "bust."',
      'The architecture demonstrates multi-paradigm proficiency: a Java-based implementation utilizing object-oriented principles such as inheritance, polymorphism, and recursive algorithms for real-time statistical analysis; a Python prototype engineered with robust input validation and try-except error handling; and a responsive web application built with modern JavaScript.',
      'The web implementation features a custom sound engine developed via the Web Audio API to synthesize real-time game audio and utilizes CSS grid for dynamic dice animations. The computer opponent employs a probabilistic decision-making layer, specifically calculating turn-skipping chances based on current score proximity to the target, forcing users to critically analyze competitive odds and optimal roll timing.',
    ],
    tags: ['java', 'python', 'javascript', 'oop'],
    links: { github: 'https://github.com/draggle/dice-duel-showdown', demo: 'https://draggle.github.io/dice-duel-showdown/' },
    thumbnail: { emoji: '🎲', gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)' },
    featured: false,
  },
  {
    slug: 'edubuddy',
    title: 'edubuddy',
    shortDescription:
      'Native iOS productivity platform architected during a selective technical mentorship at Apple, streamlining academic workflows through intelligent task orchestration.',
    description: [
      'Architected a native iOS productivity platform during a selective technical mentorship at Apple to streamline academic workflows through a personalized recommendation engine and HIG-aligned interface design. EduBuddy serves as a centralized hub for intelligent task orchestration, managing course-specific data persistence, automated due-date tracking, and prioritized academic timelines to reduce student cognitive load.',
      'The platform integrates a behavioral productivity suite designed to reinforce deep-work habits: a focus timer optimized for Pomodoro sessions; a smart repository for categorized academic notes; and context-aware study triggers leveraging haptic feedback. To improve user retention, the system employs a recommendation engine that analyzes workload patterns to suggest optimal study blocks and resources based on upcoming deadlines.',
      'Performance was prioritized through a native architecture to ensure a fluid experience during heavy data interactions. Implemented SwiftUI lifecycle tuning, lazy loading, and an optimized view hierarchy. The project culminated in a technical demo presented to Apple engineers, where it was selected for showcase among over 200 participants. Reduced UI load times by 400ms and memory usage by 25% via lazy loading and SwiftUI lifecycle optimization.',
    ],
    tags: ['swift', 'swiftui', 'ios', 'apple hig'],
    links: {
      recommendation:
        'https://github.com/draggle/portfolio/raw/main/Ayan_Letter_Of_Recommendation.pdf',
    },
    thumbnail: { emoji: '📚', gradient: 'linear-gradient(135deg, #1e3a5f, #2563eb)' },
    featured: false,
    builtAt: 'Apple iOS Mentorship Program',
  },
]
