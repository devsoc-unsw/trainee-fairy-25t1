const marketingApplication: Application = {
  portfolio: "marketing",
  division: "internal",
  status: "accepted",
  score: 91,
  dateSubmitted: "2024-04-10",
  answers: {
    general: {
      motivation:
        "I'm passionate about the mission of this society and believe it aligns perfectly with my career goals. I've been following your work for the past year and have been impressed by the impact you've made on campus. I'm excited about the opportunity to contribute my skills and learn from experienced members.",
      experience:
        "I've been involved in several student organizations throughout my university career. Last year, I served as the secretary for the Computer Science Club, where I organized weekly meetings and maintained communication with over 50 members. I also volunteered at three campus-wide events, which gave me valuable experience in event management and teamwork.",
      "time-commitment": "10-15 hours",
      strengths:
        "My key strengths include strong organizational skills, attention to detail, and the ability to work effectively in teams. I'm also a quick learner and adapt well to new environments. My communication skills, both written and verbal, allow me to express ideas clearly and collaborate effectively with others.",
      leadership:
        "During my second year, I led a team of five students for our software engineering project. When we faced challenges with the project timeline, I organized additional meetings, redistributed tasks based on each member's strengths, and implemented a tracking system to monitor our progress. As a result, we completed the project on time and received an A grade.",
    },
    specific: {
      "marketing-experience":
        "I've managed social media accounts for two student organizations, increasing engagement by 40% through consistent posting and interactive content. I also created and executed a digital marketing campaign for our department's annual showcase, which resulted in a 25% increase in attendance compared to the previous year.",
      "social-media": ["Instagram", "LinkedIn", "TikTok"],
      "campaign-idea":
        "I propose a 'Member Spotlight' campaign that showcases the diverse talents and achievements of society members. Each week, we would feature a different member across all social media platforms, highlighting their work, contributions, and personal story. This would humanize the society, showcase the benefits of membership, and create engaging, shareable content that reaches potential new members through existing networks.",
    }
  }
}

const educationApplication: Application = {
  portfolio: "education",
  division: "technical",
  status: "pending",
  score: null,
  dateSubmitted: "2024-04-10",
  answers: {
    general: {
      motivation:
        "I'm passionate about the mission of this society and believe it aligns perfectly with my career goals. I've been following your work for the past year and have been impressed by the impact you've made on campus. I'm excited about the opportunity to contribute my skills and learn from experienced members.",
      experience:
        "I've been involved in several student organizations throughout my university career. Last year, I served as the secretary for the Computer Science Club, where I organized weekly meetings and maintained communication with over 50 members. I also volunteered at three campus-wide events, which gave me valuable experience in event management and teamwork.",
      "time-commitment": "10-15 hours",
      strengths:
        "My key strengths include strong organizational skills, attention to detail, and the ability to work effectively in teams. I'm also a quick learner and adapt well to new environments. My communication skills, both written and verbal, allow me to express ideas clearly and collaborate effectively with others.",
      leadership:
        "During my second year, I led a team of five students for our software engineering project. When we faced challenges with the project timeline, I organized additional meetings, redistributed tasks based on each member's strengths, and implemented a tracking system to monitor our progress. As a result, we completed the project on time and received an A grade.",
    },
    specific: {
      "coding-languages": ["JavaScript", "Python", "Java"],
      "dev-experience":
        "I've built several web applications using React and Node.js, including a task management system for my student club and a personal portfolio website. I also contributed to an open-source project that helps students find study groups. In these projects, I've gained experience with front-end development, API integration, and database management.",
      github: "https://github.com/username",
      "dev-challenge":
        "I would start by understanding the society's needs and target audience through stakeholder interviews. Then, I'd create wireframes and mockups for approval before development. For implementation, I'd use Next.js for its SEO benefits and server-side rendering capabilities, with a clean, responsive design. I'd ensure the site is accessible, mobile-friendly, and easy to maintain, with clear documentation for future developers.",
    }
  }
}

export const dummyData = {
  zid: "z1234567",
  name: "Isabella Garcia",
  email: "igarcia@university.edu",
  applications: [ marketingApplication, educationApplication ],
  diversity: {
    student_type: "International",
    education: "Undergraduate",
    gender: "Female",
    year: 3
  },
  recommendations: [
    {
      author: "Eddie Lake",
      comment: "Creative thinker with excellent portfolio"
    }
  ],
  redFlags: [],
  coi: []
}

export type Application = {
  portfolio: PortfolioType
  division: "internal" | "external" | "technical"
  status: "accepted" | "rejected" | "pending"
  score: number | null
  dateSubmitted: string
  answers: {
    general: Record<string, string>
    specific: Record<string, string | string[]>
  }
}

export type Question = {
  id: string
  question: string
  type: "text" | "longText" | "multipleChoice"
  options?: string[]
  required: boolean
}

const generalQuestions: Question[] = [
  {
    id: "motivation",
    question: "Why are you interested in joining our society?",
    type: "longText",
    required: true,
  },
  {
    id: "experience",
    question: "Describe any relevant experience you have.",
    type: "longText",
    required: true,
  },
  {
    id: "time-commitment",
    question: "How many hours per week can you commit to the society?",
    type: "text",
    required: true,
  },
  {
    id: "strengths",
    question: "What are your key strengths that would benefit the society?",
    type: "longText",
    required: true,
  },
  {
    id: "leadership",
    question: "Describe a situation where you demonstrated leadership.",
    type: "longText",
    required: true,
  },
]

const marketingQuestions: Question[] = [
  {
    id: "marketing-experience",
    question: "Describe your experience with digital marketing.",
    type: "longText",
    required: true,
  },
  {
    id: "social-media",
    question: "Which social media platforms are you most experienced with?",
    type: "multipleChoice",
    options: ["Instagram", "TikTok", "LinkedIn", "Twitter", "Facebook", "Other"],
    required: true,
  },
  {
    id: "campaign-idea",
    question: "Propose a marketing campaign idea for our society.",
    type: "longText",
    required: true,
  },
]

const educationQuestions: Question[] = [
  {
    id: "coding-languages",
    question: "Which programming languages are you proficient in?",
    type: "multipleChoice",
    options: ["JavaScript", "Python", "Java", "C++", "Ruby", "Other"],
    required: true,
  },
  {
    id: "dev-experience",
    question: "Describe your experience with software development projects.",
    type: "longText",
    required: true,
  },
  {
    id: "github",
    question: "Please provide a link to your GitHub profile or portfolio.",
    type: "text",
    required: false,
  },
  {
    id: "dev-challenge",
    question: "How would you approach developing a new website for our society?",
    type: "longText",
    required: true,
  },
]

export const Questions = {
  general: generalQuestions,
  marketing: marketingQuestions,
  education: educationQuestions,
}

type PortfolioType = keyof typeof Questions;