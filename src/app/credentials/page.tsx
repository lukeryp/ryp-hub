'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Key, Server, Mail, AlertCircle } from 'lucide-react'

interface Credential {
  service: string
  description: string
  whereStored: string
  accountEmail?: string
  url?: string
  category: 'api' | 'hosting' | 'domain' | 'analytics' | 'other'
}

const CREDENTIALS: Credential[] = [
  // APIs
  {
    service: 'Anthropic API',
    description: 'Claude AI — used in CHIP, Certification Dashboard, Command Center',
    whereStored: 'Vercel env vars (ryp-certification), local .env.local',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://console.anthropic.com',
    category: 'api',
  },
  {
    service: 'Supabase',
    description: 'Database & auth — used across RYP apps',
    whereStored: 'Vercel env vars per project (SUPABASE_URL, SUPABASE_ANON_KEY)',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://supabase.com/dashboard',
    category: 'api',
  },
  {
    service: 'OpenAI API',
    description: 'GPT models — backup AI provider',
    whereStored: 'Local .env.local, Vercel env vars where needed',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://platform.openai.com',
    category: 'api',
  },
  // Hosting
  {
    service: 'Vercel',
    description: 'Hosting for all Next.js apps',
    whereStored: 'Vercel dashboard — team account',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://vercel.com/dashboard',
    category: 'hosting',
  },
  {
    service: 'GitHub',
    description: 'Source code — lukeryp org',
    whereStored: 'GitHub — personal access tokens in local keychain',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://github.com/lukeryp',
    category: 'hosting',
  },
  // Domains
  {
    service: 'Namecheap',
    description: 'Domain registrar — known.golf, rypgolf.com, pgalesson.com',
    whereStored: 'Namecheap account',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://namecheap.com',
    category: 'domain',
  },
  {
    service: 'Cloudflare',
    description: 'DNS & CDN — parallaxgolf.ai and others',
    whereStored: 'Cloudflare dashboard',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://dash.cloudflare.com',
    category: 'domain',
  },
  // Analytics
  {
    service: 'Vercel Analytics',
    description: 'Web analytics — enabled on ryp-certification, hub',
    whereStored: 'Built into Vercel — no separate key needed',
    category: 'analytics',
  },
  {
    service: 'PostHog',
    description: 'Product analytics & session replay',
    whereStored: 'Vercel env vars (NEXT_PUBLIC_POSTHOG_KEY)',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://app.posthog.com',
    category: 'analytics',
  },
  // Other
  {
    service: 'Stripe',
    description: 'Payments — used for Certification, future products',
    whereStored: 'Vercel env vars (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://dashboard.stripe.com',
    category: 'other',
  },
  {
    service: 'Resend',
    description: 'Transactional email — used in Certification Dashboard',
    whereStored: 'Vercel env vars (RESEND_API_KEY)',
    accountEmail: 'luke@rypgolf.com',
    url: 'https://resend.com/dashboard',
    category: 'other',
  },
]

const CATEGORY_CONFIG = {
  api: { label: 'APIs & AI', color: 'text-blue-400', dot: 'bg-blue-400' },
  hosting: { label: 'Hosting & Code', color: 'text-purple-400', dot: 'bg-purple-400' },
  domain: { label: 'Domains & DNS', color: 'text-primary', dot: 'bg-primary' },
  analytics: { label: 'Analytics', color: 'text-yellow-400', dot: 'bg-yellow-400' },
  other: { label: 'Payments & Email', color: 'text-orange-400', dot: 'bg-orange-400' },
}

const CATEGORIES = ['api', 'hosting', 'domain', 'analytics', 'other'] as const

export default function CredentialsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Credentials &amp; Services</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Reference only — actual keys are stored securely, not here
        </p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
        <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-300">
          This page is a reference map only. Never paste actual API keys or secrets here.
          All credentials are stored in Vercel environment variables or your local keychain.
        </p>
      </div>

      {CATEGORIES.map((cat) => {
        const creds = CREDENTIALS.filter((c) => c.category === cat)
        if (creds.length === 0) return null
        const { label, color, dot } = CATEGORY_CONFIG[cat]
        return (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-1 w-4 rounded-full ${dot}`} />
              <h2 className={`text-sm font-semibold uppercase tracking-widest ${color}`}>
                {label}
              </h2>
            </div>
            <div className="space-y-2">
              {creds.map((cred) => (
                <Card key={cred.service} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 flex-shrink-0 text-muted-foreground">
                          <Key size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">
                              {cred.service}
                            </span>
                            {cred.accountEmail && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Mail size={10} />
                                {cred.accountEmail}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{cred.description}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Server size={11} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-[11px] text-muted-foreground">{cred.whereStored}</span>
                          </div>
                        </div>
                      </div>
                      {cred.url && (
                        <a
                          href={cred.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
