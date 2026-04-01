'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone } from 'lucide-react'

type ContactRole = 'team' | 'beta'

interface Contact {
  name: string
  role: string
  group: ContactRole
  club?: string
  email?: string
  phone?: string
  notes?: string
}

const CONTACTS: Contact[] = [
  // Team
  {
    name: 'Yannick',
    role: 'Lead Developer',
    group: 'team',
    notes: 'Full-stack — Known, FORGE, CHIP',
  },
  {
    name: 'Mike',
    role: 'Operations & Partnerships',
    group: 'team',
    notes: 'RYP Foundation, Builders Challenge',
  },
  {
    name: 'Max',
    role: 'Developer',
    group: 'team',
    notes: 'Known photo upload, CHIP exercise DB',
  },
  {
    name: 'Phil',
    role: 'Advisor',
    group: 'team',
  },
  // Beta testers — Interlachen pros
  {
    name: 'Nathan Ollhoff',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
    notes: 'Primary Known beta tester',
  },
  {
    name: 'Blaize Hauge',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
  {
    name: 'Nick Dittrich',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
  {
    name: 'Sam Nodler',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
  {
    name: "Jack O'Brien",
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
  {
    name: 'Adam Wood',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
  {
    name: 'Kyle Berg',
    role: 'Teaching Pro',
    group: 'beta',
    club: 'Interlachen CC',
  },
]

function ContactCard({ contact }: { contact: Contact }) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm text-foreground">{contact.name}</div>
            <div className="text-xs text-muted-foreground">
              {contact.role}
              {contact.club && ` · ${contact.club}`}
            </div>
            {contact.notes && (
              <div className="text-[11px] text-muted-foreground/70 mt-1 italic">{contact.notes}</div>
            )}
            {(contact.email || contact.phone) && (
              <div className="flex items-center gap-3 mt-2">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail size={11} />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone size={11} />
                    {contact.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ContactsPage() {
  const team = CONTACTS.filter((c) => c.group === 'team')
  const beta = CONTACTS.filter((c) => c.group === 'beta')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {team.length} team members · {beta.length} beta testers
        </p>
      </div>

      {/* Team */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-4 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {team.map((c) => (
            <ContactCard key={c.name} contact={c} />
          ))}
        </div>
      </section>

      {/* Beta Testers */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-4 rounded-full bg-blue-400" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Beta Testers
          </h2>
          <span className="text-xs text-muted-foreground">Interlachen CC</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beta.map((c) => (
            <ContactCard key={c.name} contact={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
