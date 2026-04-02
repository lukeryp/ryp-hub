export type ProjectStatus = 'green' | 'yellow' | 'red' | 'blue'
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked'
export type IdeaStatus = 'inbox' | 'reviewed' | 'converted'
export type Assignee = 'Luke' | 'Yannick' | 'Mike' | 'Max' | 'Phil'

export interface Milestone {
  id: string
  label: string
  date: string
  done: boolean
}

export interface Project {
  slug: string
  name: string
  emoji: string
  status: ProjectStatus
  description: string
  liveUrl: string
  startDate?: string
  keyContact?: string
  milestones?: Milestone[]
}

export interface Task {
  id: string
  projectSlug: string
  title: string
  status: TaskStatus
  assignee: Assignee | null
  createdAt: string
}

export interface Idea {
  id: string
  text: string
  status: IdeaStatus
  createdAt: string
}

export interface Focus {
  slot1: string
  slot2: string
  slot3: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'known',
    name: 'Known',
    emoji: '⛳',
    status: 'green',
    description: 'Member recognition app at known.golf',
    liveUrl: 'https://known.golf/interlachen',
  },
  {
    slug: 'forge',
    name: 'FORGE',
    emoji: '🔨',
    status: 'yellow',
    description: 'Practice scoring system',
    liveUrl: 'https://rypgolf.com/forge',
  },
  {
    slug: 'chip',
    name: 'CHIP',
    emoji: '🤖',
    status: 'red',
    description: 'AI workout builder',
    liveUrl: 'https://rypgolf.com/chip',
  },
  {
    slug: 'ryp-red',
    name: 'Ryp Red',
    emoji: '📊',
    status: 'yellow',
    description: 'Strokes gained analysis',
    liveUrl: 'https://rypgolf.com/red',
  },
  {
    slug: 'certification-dashboard',
    name: 'Certification Dashboard',
    emoji: '🎓',
    status: 'green',
    description: 'RYP instructor certification platform',
    liveUrl: 'https://cert.rypgolf.com',
  },
  {
    slug: 'icc-junior-league',
    name: 'ICC Junior League Apply',
    emoji: '⛳',
    status: 'green',
    description: 'Staff application portal for Interlachen Junior League Summer 2026',
    liveUrl: 'https://icc-junior-league-apply.vercel.app',
  },
  {
    slug: 'command-center',
    name: 'Command Center',
    emoji: '🖥️',
    status: 'green',
    description: 'This dashboard — hub.rypgolf.com',
    liveUrl: 'https://hub.rypgolf.com',
  },
  {
    slug: 'the-golf-textbook',
    name: 'The Golf Textbook',
    emoji: '📚',
    status: 'green',
    description: 'Book launching April 6',
    liveUrl: 'https://thegolftextbook.com',
  },
  {
    slug: 'ryp-foundation',
    name: 'RYP Foundation',
    emoji: '🌱',
    status: 'yellow',
    description: 'Youth golf nonprofit',
    liveUrl: 'https://rypfoundation.org',
  },
  {
    slug: 'builders-challenge',
    name: 'Builders Challenge',
    emoji: '🏗️',
    status: 'blue',
    description: 'Solomon Hughes Builders Challenge — youth golf program through the RYP Foundation',
    liveUrl: 'https://rypfoundation.org',
    startDate: '2026-05-01',
    keyContact: 'Jaycee Rhodes',
    milestones: [
      { id: '1', label: 'Program Kickoff', date: '2026-05-01', done: false },
      { id: '2', label: 'Participant Recruitment', date: '2026-04-15', done: false },
      { id: '3', label: 'Sponsor Outreach Complete', date: '2026-04-22', done: false },
    ],
  },
]

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    projectSlug: 'the-golf-textbook',
    title: 'Finalize launch email sequence',
    status: 'in-progress',
    assignee: 'Luke',
    createdAt: new Date('2026-03-29').toISOString(),
  },
  {
    id: '2',
    projectSlug: 'known',
    title: 'Add photo upload to member profiles',
    status: 'todo',
    assignee: 'Max',
    createdAt: new Date('2026-03-28').toISOString(),
  },
  {
    id: '3',
    projectSlug: 'forge',
    title: 'Fix score submission bug on iOS',
    status: 'blocked',
    assignee: 'Yannick',
    createdAt: new Date('2026-03-27').toISOString(),
  },
  {
    id: '4',
    projectSlug: 'rypgolf-com',
    title: 'Design new homepage hero',
    status: 'todo',
    assignee: 'Luke',
    createdAt: new Date('2026-03-30').toISOString(),
  },
  {
    id: '5',
    projectSlug: 'ryp-foundation',
    title: 'Send Builders Challenge welcome emails',
    status: 'todo',
    assignee: 'Mike',
    createdAt: new Date('2026-03-31').toISOString(),
  },
  {
    id: '6',
    projectSlug: 'chip',
    title: 'Build exercise database schema',
    status: 'in-progress',
    assignee: 'Max',
    createdAt: new Date('2026-03-26').toISOString(),
  },
]

export const INITIAL_FOCUS: Focus = {
  slot1: 'Launch prep for The Golf Textbook (April 6)',
  slot2: 'Builders Challenge onboarding',
  slot3: '',
}

export const ASSIGNEES: Assignee[] = ['Luke', 'Yannick', 'Mike', 'Max', 'Phil']
