'use client'

import Link from 'next/link'
import { PROJECTS } from '@/lib/data'
import type { ProjectStatus } from '@/lib/data'
import { useTasks } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Calendar, User } from 'lucide-react'

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = {
    green: { label: 'On Track', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
    yellow: { label: 'In Progress', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    red: { label: 'Needs Attention', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
    blue: { label: 'Planning', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  }
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}>
      {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ProjectsPage() {
  const [tasks] = useTasks()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{PROJECTS.length} active projects</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectSlug === project.slug)
          const openTasks = projectTasks.filter((t) => t.status !== 'done').length
          const doneTasks = projectTasks.filter((t) => t.status === 'done').length

          return (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{project.emoji}</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  {(project.startDate || project.keyContact) && (
                    <div className="space-y-1 mb-3">
                      {project.startDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={11} className="text-blue-400 flex-shrink-0" />
                          <span>Starts {formatDate(project.startDate)}</span>
                        </div>
                      )}
                      {project.keyContact && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User size={11} className="text-blue-400 flex-shrink-0" />
                          <span>{project.keyContact}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {openTasks > 0
                        ? `${openTasks} open · ${doneTasks} done`
                        : doneTasks > 0
                        ? `${doneTasks} tasks done`
                        : 'No tasks yet'}
                    </div>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={11} />
                      Live
                    </a>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
