'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { PROJECTS } from '@/lib/data'
import type { ProjectStatus } from '@/lib/data'
import { useFocus, useIdeas, useTasks } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Pencil, Check, Plus, Lightbulb } from 'lucide-react'

function StatusDot({ status }: { status: ProjectStatus }) {
  const colors = {
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
  }
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[status]} flex-shrink-0`}
    />
  )
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = {
    green: { label: 'On Track', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
    yellow: { label: 'In Progress', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    red: { label: 'Needs Attention', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
    blue: { label: 'Planning', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  }
  const { label, className } = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

function FocusSlot({
  value,
  index,
  onChange,
}: {
  value: string
  index: number
  onChange: (val: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commit() {
    onChange(draft.trim())
    setEditing(false)
  }

  const labels = ['Priority 1', 'Priority 2', 'Priority 3']

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-xs text-muted-foreground w-16 flex-shrink-0">
        {labels[index]}
      </span>
      {editing ? (
        <div className="flex flex-1 items-center gap-1">
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') setEditing(false)
            }}
            onBlur={commit}
            className="h-7 text-sm bg-secondary border-primary/50 focus-visible:ring-primary"
            placeholder={`Add priority ${index + 1}…`}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 flex-shrink-0 text-primary"
            onClick={commit}
          >
            <Check size={14} />
          </Button>
        </div>
      ) : (
        <button
          onClick={startEdit}
          className="flex-1 text-left text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
        >
          {value ? (
            <>
              <span>{value}</span>
              <Pencil
                size={12}
                className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0"
              />
            </>
          ) : (
            <span className="text-muted-foreground italic">
              Tap to add priority {index + 1}…
            </span>
          )}
        </button>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [focus, setFocus] = useFocus()
  const [ideas, setIdeas] = useIdeas()
  const [tasks] = useTasks()
  const [capture, setCapture] = useState('')

  const inboxCount = ideas.filter((i) => i.status === 'inbox').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length

  function updateFocusSlot(slot: 'slot1' | 'slot2' | 'slot3', value: string) {
    setFocus({ ...focus, [slot]: value })
  }

  function addIdea() {
    const text = capture.trim()
    if (!text) return
    const idea = {
      id: Date.now().toString(),
      text,
      status: 'inbox' as const,
      createdAt: new Date().toISOString(),
    }
    setIdeas((prev) => [idea, ...prev])
    setCapture('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Command Center
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Tasks', value: inProgressCount, color: 'text-primary' },
          { label: 'Idea Inbox', value: inboxCount, color: 'text-yellow-400' },
          { label: 'Projects', value: PROJECTS.length, color: 'text-blue-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Focus */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-4 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Today&apos;s Focus
          </h2>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <FocusSlot
              value={focus.slot1}
              index={0}
              onChange={(v) => updateFocusSlot('slot1', v)}
            />
            <FocusSlot
              value={focus.slot2}
              index={1}
              onChange={(v) => updateFocusSlot('slot2', v)}
            />
            <FocusSlot
              value={focus.slot3}
              index={2}
              onChange={(v) => updateFocusSlot('slot3', v)}
            />
          </CardContent>
        </Card>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROJECTS.map((project) => {
            const projectTasks = tasks.filter(
              (t) => t.projectSlug === project.slug
            )
            const openTasks = projectTasks.filter(
              (t) => t.status !== 'done'
            ).length
            return (
              <Link key={project.slug} href={`/projects/${project.slug}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{project.emoji}</span>
                        <span className="font-semibold text-sm text-foreground">
                          {project.name}
                        </span>
                      </div>
                      <StatusDot status={project.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={project.status} />
                      <div className="flex items-center gap-2">
                        {openTasks > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {openTasks} task{openTasks !== 1 ? 's' : ''}
                          </span>
                        )}
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Capture */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-4 rounded-full bg-yellow-400" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Quick Capture
          </h2>
          {inboxCount > 0 && (
            <Link href="/ideas">
              <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-[10px] hover:bg-yellow-500/25">
                {inboxCount} in inbox
              </Badge>
            </Link>
          )}
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <span className="text-muted-foreground self-center">
                <Lightbulb size={16} />
              </span>
              <Input
                value={capture}
                onChange={(e) => setCapture(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addIdea()
                }}
                placeholder="Capture an idea — press Enter to save…"
                className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-0 text-sm placeholder:text-muted-foreground/60"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={addIdea}
                disabled={!capture.trim()}
                className="h-9 w-9 text-primary hover:bg-primary/10 flex-shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
