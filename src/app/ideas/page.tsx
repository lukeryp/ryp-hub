'use client'

import { useState } from 'react'
import { useIdeas } from '@/lib/store'
import type { IdeaStatus } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Lightbulb } from 'lucide-react'

function IdeaBadge({ status }: { status: IdeaStatus }) {
  const config: Record<IdeaStatus, { label: string; className: string }> = {
    inbox: { label: 'Inbox', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    reviewed: { label: 'Reviewed', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    converted: { label: 'Converted', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  }
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}>
      {label}
    </span>
  )
}

const IDEA_STATUSES: IdeaStatus[] = ['inbox', 'reviewed', 'converted']

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useIdeas()
  const [capture, setCapture] = useState('')
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all')

  function addIdea() {
    const text = capture.trim()
    if (!text) return
    const idea = {
      id: Date.now().toString(),
      text,
      status: 'inbox' as IdeaStatus,
      createdAt: new Date().toISOString(),
    }
    setIdeas((prev) => [idea, ...prev])
    setCapture('')
  }

  function updateStatus(id: string, status: IdeaStatus) {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  function deleteIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id))
  }

  const filtered = filter === 'all' ? ideas : ideas.filter((i) => i.status === filter)
  const counts = {
    all: ideas.length,
    inbox: ideas.filter((i) => i.status === 'inbox').length,
    reviewed: ideas.filter((i) => i.status === 'reviewed').length,
    converted: ideas.filter((i) => i.status === 'converted').length,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Idea Inbox</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {counts.inbox} unreviewed · {ideas.length} total
        </p>
      </div>

      {/* Add idea */}
      <Card className="bg-card border-border">
        <CardContent className="p-3">
          <div className="flex gap-2">
            <span className="text-muted-foreground self-center">
              <Lightbulb size={16} />
            </span>
            <Input
              value={capture}
              onChange={(e) => setCapture(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIdea()}
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

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {(['all', 'inbox', 'reviewed', 'converted'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Ideas list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter === 'all' ? 'No ideas yet. Capture one above.' : `No ${filter} ideas.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((idea) => (
            <Card key={idea.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">{idea.text}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {formatDate(idea.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <select
                    value={idea.status}
                    onChange={(e) => updateStatus(idea.id, e.target.value as IdeaStatus)}
                    className="rounded border border-input bg-secondary px-1.5 py-0.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {IDEA_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <IdeaBadge status={idea.status} />
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
