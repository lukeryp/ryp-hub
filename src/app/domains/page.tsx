'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Globe, CheckCircle, Clock, XCircle } from 'lucide-react'

type DomainStatus = 'live' | 'parked' | 'in-dev'

interface Domain {
  domain: string
  status: DomainStatus
  pointsTo?: string
  purpose: string
  registrar: string
  notes?: string
}

const DOMAINS: Domain[] = [
  {
    domain: 'known.golf',
    status: 'live',
    pointsTo: 'Vercel',
    purpose: 'Member recognition app — primary product',
    registrar: 'Namecheap',
    notes: 'known.golf/interlachen is the Interlachen CC portal',
  },
  {
    domain: 'rypgolf.com',
    status: 'live',
    pointsTo: 'Vercel',
    purpose: 'Main RYP website — currently being rebuilt',
    registrar: 'Namecheap',
  },
  {
    domain: 'hub.rypgolf.com',
    status: 'in-dev',
    pointsTo: 'Vercel (this app)',
    purpose: 'Command Center dashboard — you are here',
    registrar: 'Namecheap (subdomain)',
    notes: 'Target deployment domain for this app',
  },
  {
    domain: 'cert.rypgolf.com',
    status: 'live',
    pointsTo: 'Vercel (ryp-certification.vercel.app)',
    purpose: 'RYP instructor certification platform',
    registrar: 'Namecheap (subdomain)',
  },
  {
    domain: 'pgalesson.com',
    status: 'parked',
    purpose: 'Future use — golf lesson marketplace concept',
    registrar: 'Namecheap',
    notes: 'Parked / holding for future project',
  },
  {
    domain: 'parallaxgolf.ai',
    status: 'parked',
    purpose: 'AI golf analysis brand — future product',
    registrar: 'Cloudflare',
    notes: 'Parked on Cloudflare DNS',
  },
]

const STATUS_CONFIG: Record<DomainStatus, { label: string; icon: React.ElementType; className: string; dot: string }> = {
  live: {
    label: 'Live',
    icon: CheckCircle,
    className: 'bg-green-500/15 text-green-400 border-green-500/30',
    dot: 'bg-green-400',
  },
  'in-dev': {
    label: 'In Dev',
    icon: Clock,
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  parked: {
    label: 'Parked',
    icon: XCircle,
    className: 'bg-muted/50 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
}

export default function DomainsPage() {
  const live = DOMAINS.filter((d) => d.status === 'live')
  const inDev = DOMAINS.filter((d) => d.status === 'in-dev')
  const parked = DOMAINS.filter((d) => d.status === 'parked')

  function DomainCard({ domain }: { domain: Domain }) {
    const { label, icon: Icon, className, dot } = STATUS_CONFIG[domain.status]
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-semibold text-sm text-foreground">
                    {domain.domain}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}>
                    <Icon size={10} />
                    {label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{domain.purpose}</p>
                {domain.pointsTo && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    → {domain.pointsTo}
                  </p>
                )}
                {domain.notes && (
                  <p className="text-[11px] text-muted-foreground/70 mt-1 italic">
                    {domain.notes}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  Registrar: {domain.registrar}
                </p>
              </div>
            </div>
            <a
              href={`https://${domain.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Domain Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {DOMAINS.length} domains · {live.length} live · {inDev.length} in dev · {parked.length} parked
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Live', count: live.length, color: 'text-green-400' },
          { label: 'In Dev', count: inDev.length, color: 'text-blue-400' },
          { label: 'Parked', count: parked.length, color: 'text-muted-foreground' },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live domains */}
      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-4 rounded-full bg-green-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-green-400">
              Live
            </h2>
          </div>
          <div className="space-y-2">
            {live.map((d) => <DomainCard key={d.domain} domain={d} />)}
          </div>
        </section>
      )}

      {/* In dev */}
      {inDev.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-4 rounded-full bg-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              In Development
            </h2>
          </div>
          <div className="space-y-2">
            {inDev.map((d) => <DomainCard key={d.domain} domain={d} />)}
          </div>
        </section>
      )}

      {/* Parked */}
      {parked.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-4 rounded-full bg-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Parked
            </h2>
          </div>
          <div className="space-y-2">
            {parked.map((d) => <DomainCard key={d.domain} domain={d} />)}
          </div>
        </section>
      )}
    </div>
  )
}
