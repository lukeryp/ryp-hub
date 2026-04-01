'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PROJECTS } from '@/lib/data'
import type { TaskStatus, Assignee } from '@/lib/data'
import { ASSIGNEES } from '@/lib/data'
import { useTasks } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ExternalLink, Plus, ArrowLeft, Trash2 } from 'lucide-react'

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; className: string }> = {
    todo: { label: 'To Do', className: 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50' },
    'in-progress': { label: 'In Progress', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    done: { label: 'Done', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
    blocked: { label: 'Blocked', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}>
      {label}
    </span>
  )
}

function ProjectStatusBadge({ status }: { status: 'green' | 'yellow' | 'red' }) {
  const config = {
    green: { label: 'On Track', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
    yellow: { label: 'In Progress', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    red: { label: 'Needs Attention', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done', 'blocked']

export function ProjectDetail({ slug }: { slug: string }) {
  const project = PROJECTS.find((p) => p.slug === slug)
  const [tasks, setTasks] = useTasks()
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState<Assignee | ''>('')

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/projects" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  const projectTasks = tasks.filter((t) => t.projectSlug === slug)

  function addTask() {
    const title = newTitle.trim()
    if (!title) return
    const task = {
      id: Date.now().toString(),
      projectSlug: slug,
      title,
      status: 'todo' as TaskStatus,
      assignee: (newAssignee || null) as Assignee | null,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, task])
    setNewTitle('')
    setNewAssignee('')
  }

  function updateStatus(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const groupedTasks: Record<TaskStatus, typeof projectTasks> = {
    'in-progress': projectTasks.filter((t) => t.status === 'in-progress'),
    blocked: projectTasks.filter((t) => t.status === 'blocked'),
    todo: projectTasks.filter((t) => t.status === 'todo'),
    done: projectTasks.filter((t) => t.status === 'done'),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back */}
      <Link
        href="/projects"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft size={14} /> All Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{project.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      {/* Live URL */}
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors w-fit"
      >
        <ExternalLink size={14} />
        {project.liveUrl.replace('https://', '')}
      </a>

      {/* Task stats */}
      <div className="flex gap-4 text-sm">
        {TASK_STATUSES.map((s) => (
          <div key={s} className="text-center">
            <div className="font-bold text-foreground">{groupedTasks[s].length}</div>
            <div className="text-[10px] text-muted-foreground capitalize">{s === 'in-progress' ? 'active' : s}</div>
          </div>
        ))}
      </div>

      {/* Add task */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Add Task
          </p>
          <div className="flex gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Task title…"
              className="flex-1 bg-secondary border-secondary text-sm"
            />
            <select
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value as Assignee | '')}
              className="rounded-md border border-input bg-secondary px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Unassigned</option>
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <Button
              onClick={addTask}
              disabled={!newTitle.trim()}
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      {projectTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No tasks yet. Add one above.
        </p>
      ) : (
        <div className="space-y-6">
          {(['in-progress', 'blocked', 'todo', 'done'] as TaskStatus[]).map((statusGroup) => {
            const group = groupedTasks[statusGroup]
            if (group.length === 0) return null
            return (
              <div key={statusGroup}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {statusGroup === 'in-progress' ? 'In Progress' : statusGroup.charAt(0).toUpperCase() + statusGroup.slice(1)}
                  <span className="ml-1.5 text-muted-foreground/60">({group.length})</span>
                </h3>
                <div className="space-y-2">
                  {group.map((task) => (
                    <Card key={task.id} className="bg-card border-border">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                          >
                            {task.title}
                          </p>
                          {task.assignee && (
                            <p className="text-xs text-muted-foreground mt-0.5">{task.assignee}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <select
                            value={task.status}
                            onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                            className="rounded border border-input bg-secondary px-1.5 py-0.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            {TASK_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <TaskStatusBadge status={task.status} />
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
