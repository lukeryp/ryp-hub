'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PROJECTS, ASSIGNEES } from '@/lib/data'
import type { TaskStatus, Assignee } from '@/lib/data'
import { useTasks } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

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

const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done', 'blocked']

export default function TasksPage() {
  const [tasks, setTasks] = useTasks()
  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterAssignee, setFilterAssignee] = useState<Assignee | 'all'>('all')

  function updateStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const filtered = tasks.filter((t) => {
    if (filterProject !== 'all' && t.projectSlug !== filterProject) return false
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false
    return true
  })

  // Group by status for display
  const grouped: Record<TaskStatus, typeof filtered> = {
    'in-progress': filtered.filter((t) => t.status === 'in-progress'),
    blocked: filtered.filter((t) => t.status === 'blocked'),
    todo: filtered.filter((t) => t.status === 'todo'),
    done: filtered.filter((t) => t.status === 'done'),
  }

  function getProject(slug: string) {
    return PROJECTS.find((p) => p.slug === slug)
  }

  const selectClass =
    'rounded-md border border-input bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          {filtered.length !== tasks.length ? ` of ${tasks.length}` : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Projects</option>
          {PROJECTS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.emoji} {p.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
          className={selectClass}
        >
          <option value="all">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value as Assignee | 'all')}
          className={selectClass}
        >
          <option value="all">All Assignees</option>
          {ASSIGNEES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {(filterProject !== 'all' || filterStatus !== 'all' || filterAssignee !== 'all') && (
          <button
            onClick={() => {
              setFilterProject('all')
              setFilterStatus('all')
              setFilterAssignee('all')
            }}
            className="px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground bg-secondary transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Task groups */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No tasks match your filters.
        </p>
      ) : (
        <div className="space-y-6">
          {(['in-progress', 'blocked', 'todo', 'done'] as TaskStatus[]).map((statusGroup) => {
            const group = grouped[statusGroup]
            if (group.length === 0) return null
            return (
              <div key={statusGroup}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {statusGroup === 'in-progress' ? 'In Progress' : statusGroup.charAt(0).toUpperCase() + statusGroup.slice(1)}
                  <span className="ml-1.5 opacity-60">({group.length})</span>
                </h3>
                <div className="space-y-2">
                  {group.map((task) => {
                    const project = getProject(task.projectSlug)
                    return (
                      <Card key={task.id} className="bg-card border-border">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {project && (
                                <Link
                                  href={`/projects/${project.slug}`}
                                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {project.emoji} {project.name}
                                </Link>
                              )}
                              {task.assignee && (
                                <span className="text-[11px] text-muted-foreground">
                                  · {task.assignee}
                                </span>
                              )}
                            </div>
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
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
