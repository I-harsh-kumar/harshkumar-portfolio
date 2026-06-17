import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Twitter,
  Globe
} from 'lucide-react'

type BlogCategory = 'All' | 'DevOps' | 'Frontend' | 'Design'

type Blog = {
  id: string
  category: Exclude<BlogCategory, 'All'>
  title: string
  description: string
  dateISO: string
  readMins: number
}

type StatusResponse = {
  ok: boolean
  service?: string
  timestamp?: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function clampText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text
  return text.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…'
}

function Badge({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-surfaceBorder/70 bg-surface/20 px-3 py-1 text-xs text-textMuted ${className}`}
    >
      {children}
    </span>
  )
}

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-surfaceBorder/60 bg-surface/20 px-2.5 py-1 text-[11px] font-medium text-textMuted">
      {label}
    </span>
  )
}

function SocialLink({
  href,
  label,
  icon
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  const isExternal = href.startsWith('http')
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/30 px-4 py-2 text-sm text-textPrimary transition hover:border-emerald/40 hover:bg-surface/60 hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
      aria-label={label}
    >
      {icon}
      <span className="text-textPrimary">{label}</span>
    </a>
  )
}

export default function App() {
  const [activeBlogCategory, setActiveBlogCategory] = useState<BlogCategory>('All')
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  const blogs: Blog[] = useMemo(
    () => [
      {
        id: 'blog-1',
        category: 'DevOps',
        title: 'Optimizing CI/CD Build Times for Next.js Deployments on Vercel',
        description:
          'Shave minutes off build pipelines with caching strategy, dependency graph hygiene, and targeted test execution—without sacrificing release safety.',
        dateISO: '2026-03-14',
        readMins: 7
      },
      {
        id: 'blog-2',
        category: 'Design',
        title: 'From Figma to Production: Maintaining Design System Integrity',
        description:
          'Keep tokens consistent from prototype to UI implementation, reduce drift, and build a workflow that scales cleanly across teams.',
        dateISO: '2026-02-02',
        readMins: 6
      },
      {
        id: 'blog-3',
        category: 'Frontend',
        title: 'Architecting High-Throughput Web Applications with Redis and Node.js',
        description:
          'Apply latency-first patterns—cache-aside, safe concurrency, background invalidation, and instrumentation—to keep systems predictable.',
        dateISO: '2026-01-18',
        readMins: 8
      }
    ],
    []
  )

  const filteredBlogs = useMemo(() => {
    if (activeBlogCategory === 'All') return blogs
    return blogs.filter((b) => b.category === activeBlogCategory)
  }, [activeBlogCategory, blogs])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/status')
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = (await res.json()) as StatusResponse
        if (!alive) return
        setStatus(json)
        setStatusError(null)
      } catch (e) {
        if (!alive) return
        setStatusError(e instanceof Error ? e.message : 'Unknown error')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const projectCards = useMemo(
    () => [
      {
        id: 'p1',
        badge: 'Hackathon Winner',
        badgeTone: 'emerald',
        title: 'ByteRush — Edge Observability for Full-Stack Apps',
        description:
          'Built a low-latency telemetry pipeline to unify frontend events with backend traces, enabling rapid debugging during demos and production rollouts.',
        tech: ['React', 'TypeScript', 'Node.js', 'Redis', 'CI/CD'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      },
      {
        id: 'p2',
        badge: 'Full-Stack Application',
        badgeTone: 'indigo',
        title: 'DesignOps Platform — Design System to Runtime Sync',
        description:
          'Automated design token generation and validated UI consistency with a PR workflow that enforces semantic spacing, typography, and color constraints.',
        tech: ['Figma', 'Tailwind CSS', 'React', 'PostgreSQL', 'GitHub Actions'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      },
      {
        id: 'p3',
        badge: 'Automation',
        badgeTone: 'emerald',
        title: 'Cloud Engine Scripts — Deployment Reliability Kit',
        description:
          'Created a hardened release toolkit with deterministic builds, cache priming, and rollback-safe deploy steps for production stability.',
        tech: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/GCP', 'Nginx'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      }
    ],
    []
  )

  const skillDomains = useMemo(
    () => [
      {
        title: 'Design / UX',
        icon: <Sparkles className="h-4 w-4 text-emerald" aria-hidden="true" />,
        bullets: ['Wireframing', 'Figma', 'User Flows', 'Prototyping']
      },
      {
        title: 'Frontend / Full-Stack',
        icon: <Globe className="h-4 w-4 text-indigo" aria-hidden="true" />,
        bullets: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Database Architecture']
      },
      {
        title: 'DevOps / Cloud',
        icon: <Sparkles className="h-4 w-4 text-emerald" aria-hidden="true" />,
        bullets: ['CI/CD Pipelines', 'Vercel Deployment', 'Docker', 'Cloud Infrastructure']
      }
    ],
    []
  )

  const funFacts = useMemo(
    () => [
      {
        k: 'Bias for clarity',
        v: 'Interfaces that reduce cognitive load by design.'
      },
      {
        k: 'Systems thinking',
        v: 'Performance budgets, instrumentation, and guardrails.'
      },
      {
        k: 'Ship safely',
        v: 'Automated tests + release workflows tuned for speed.'
      }
    ],
    []
  )

  const blogCategories: BlogCategory[] = ['All', 'DevOps', 'Frontend', 'Design']

  return (
    <div className="min-h-screen bg-bg text-textPrimary">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-textPrimary focus:ring-2 focus:ring-emerald/60"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-surfaceBorder/70 bg-bg/60 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Primary navigation">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-surfaceBorder/80 bg-surface/30 shadow-glass">
              <Sparkles className="h-4 w-4 text-emerald" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Harsh Kumar</div>
              <div className="text-xs text-textMuted">// BytePhantom</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex" role="navigation" aria-label="Section links">
            <a className="px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" href="#about">
              About
            </a>
            <a className="px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" href="#expertise">
              Expertise
            </a>
            <a className="px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" href="#projects">
              Projects
            </a>
            <a className="px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" href="#blogs">
              Blogs
            </a>
            <a className="px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" href="#contact">
              Contact
            </a>

            <a
              href="#contact"
              className="ml-2 inline-flex items-center justify-center rounded-md border border-surfaceBorder/70 bg-surface/20 px-4 py-2 text-sm font-medium text-textPrimary transition hover:border-emerald/50 hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Resume
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pt-14" aria-labelledby="hero-title">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-surfaceBorder/80 bg-surface/30 px-4 py-2 text-xs text-textMuted">
                <span className="text-emerald" aria-hidden="true">⚡</span>
                <span className="font-medium text-textPrimary">UI/UX Designer • Full-Stack Dev • DevOps Engineer</span>
              </div>

              <h1 id="hero-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Engineering scalable systems with user-first design.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-textMuted">
                Turning edge into code, chasing bugs, and breaking things (just to fix them later). From hackathon-winning UI/UX
                craft to full-stack architecture, I build interfaces that feel instant and systems that ship reliably. Next, I
                automate infrastructure and CI/CD so products scale with confidence.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-md bg-emerald px-5 py-3 text-sm font-semibold text-bg shadow-[0_10px_30px_rgba(16,185,129,0.18)] transition hover:bg-emerald/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  View Projects
                </a>
                <a
                  href="#blogs"
                  className="inline-flex items-center justify-center rounded-md border border-surfaceBorder/80 bg-surface/10 px-5 py-3 text-sm font-medium text-textPrimary transition hover:border-emerald/40 hover:bg-surface/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Read Articles
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/20 px-3 py-2 text-textMuted">
                  <span className="text-emerald">●</span>
                  <span className="text-sm">{status ? `API: ${status.ok ? 'Online' : 'Offline'}` : 'API: Checking…'}</span>
                </div>
                {statusError ? (
                  <div className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/20 px-3 py-2 text-textMuted" role="status">
                    <span className="text-emerald">!</span>
                    <span className="text-sm">API error: {statusError}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="lg:pt-2">
              <div className="rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5 shadow-glass">
                <h2 className="text-sm font-semibold tracking-wide text-textPrimary">Core Principles</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { t: 'Minimal UI', d: 'Every pixel earns its place.' },
                    { t: 'Reliable Systems', d: 'Instrumentation-first shipping.' },
                    { t: 'Fast Feedback', d: 'CI pipelines tuned for iteration.' },
                    { t: 'Human-Scaled', d: 'Design decisions grounded in users.' }
                  ].map((x) => (
                    <div key={x.t} className="rounded-xl border border-surfaceBorder/60 bg-surface/20 p-4">
                      <div className="text-sm font-semibold text-textPrimary">{x.t}</div>
                      <div className="mt-1 text-sm text-textMuted">{x.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge>Vercel-ready</Badge>
                <Badge className="border-emerald/60 text-textPrimary">Focus states</Badge>
                <Badge>Semantic HTML</Badge>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 pb-16" aria-labelledby="about-title">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 id="about-title" className="text-2xl font-semibold tracking-tight">About & Tech Playground</h2>
              <p className="mt-3 max-w-xl text-textMuted leading-relaxed">
                I’m obsessed with building from the bottom up—kernels, compilers, and cloud orchestration—then translating that
                rigor into premium user interfaces. Coffee fuels the curiosity; structure keeps the execution sharp.
              </p>

              <div className="mt-6 rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5">
                <h3 className="text-sm font-semibold tracking-wide text-textPrimary">Fun Facts</h3>
                <div className="mt-4 grid gap-3">
                  {funFacts.map((f) => (
                    <div key={f.k} className="rounded-xl border border-surfaceBorder/60 bg-surface/20 p-4">
                      <div className="text-sm font-semibold text-textPrimary">{f.k}</div>
                      <div className="mt-1 text-sm text-textMuted">{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="expertise" className="lg:pt-1">
              <h3 className="text-sm font-semibold tracking-wide text-textMuted">Expertise Domains</h3>
              <div className="mt-3 grid gap-3">
                {skillDomains.map((domain) => (
                  <div key={domain.title} className="rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5">
                    <div className="flex items-center gap-3">
                      {domain.icon}
                      <div className="text-base font-semibold text-textPrimary">{domain.title}</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {domain.bullets.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center rounded-md border border-surfaceBorder/60 bg-surface/20 px-2.5 py-1 text-[11px] font-medium text-textMuted"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5">
                <div className="text-base font-semibold text-textPrimary">Design → Engineering Loop</div>
                <p className="mt-2 text-sm leading-relaxed text-textMuted">
                  I convert interface intent into implementation constraints, then validate performance and usability with
                  instrumentation and release-safe CI/CD.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl px-4 pb-16" aria-labelledby="projects-title">
          <div className="flex items-end justify-between gap-3">
            <h2 id="projects-title" className="text-2xl font-semibold tracking-tight">Projects (Hackathons & Engineering)</h2>
            <div className="hidden text-sm text-textMuted sm:block">Selected work—built for reliability and clarity.</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectCards.map((p) => (
              <article key={p.id} className="rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5 shadow-glass">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${p.badgeTone === 'emerald' ? 'border-emerald/60 text-emerald' : 'border-indigo/60 text-indigo'} bg-surface/20`}
                  >
                    {p.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-textPrimary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-textMuted">{p.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <TechPill key={t} label={t} />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/20 px-3 py-2 text-sm text-textPrimary transition hover:border-emerald/40 hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/20 px-3 py-2 text-sm text-textPrimary transition hover:border-emerald/40 hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                    aria-label="Live Demo"
                  >
                    <span className="hidden sm:inline">Live Demo</span>
                    <ArrowRight className="h-4 w-4 text-emerald" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="blogs" className="mx-auto max-w-6xl px-4 pb-16" aria-labelledby="blogs-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="blogs-title" className="text-2xl font-semibold tracking-tight">Engine-Ready Blogs</h2>
            <div className="text-sm text-textMuted">Filter by category with a smooth, focused UI.</div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
            {blogCategories.map((cat) => {
              const active = activeBlogCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveBlogCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 ${active ? 'border-emerald/60 bg-surface/40 text-textPrimary' : 'border-surfaceBorder/70 bg-surface/20 text-textMuted hover:border-emerald/30 hover:text-textPrimary'}`}
                  aria-selected={active}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((b) => (
              <article key={b.id} className="rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-5 shadow-glass">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-surfaceBorder/70 bg-surface/20 px-3 py-1 text-xs text-emerald">
                    {b.category}
                  </span>
                </div>
                <div className="mt-4 text-xs text-textMuted">
                  {formatDate(b.dateISO)} • {b.readMins} min read
                </div>
                <h3 className="mt-2 text-base font-semibold text-textPrimary">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-textMuted">{clampText(b.description, 130)}</p>

                <a
                  href="#"
                  className="group mt-5 inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-surface/20 px-3 py-2 text-sm text-textPrimary transition hover:border-emerald/40 hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`Read Article: ${b.title}`}
                >
                  <span className="font-medium">Read Article</span>
                  <ArrowRight className="h-4 w-4 text-emerald transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 pb-14" aria-labelledby="contact-title">
          <div className="rounded-2xl border border-surfaceBorder/80 bg-surface/30 p-8 shadow-glass">
            <h2 id="contact-title" className="text-2xl font-semibold tracking-tight">Let's build something efficient.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-textMuted">
              Reach out directly or connect on social. I’m open to engineering, UI/UX, and DevOps collaboration.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SocialLink
                href="https://linkedin.com/in/harsh-kumar-453a32236"
                label="LinkedIn"
                icon={<Linkedin className="h-4 w-4 text-emerald" aria-hidden="true" />}
              />
              <SocialLink
                href="https://twitter.com/@text2hk"
                label="Twitter/X"
                icon={<Twitter className="h-4 w-4 text-emerald" aria-hidden="true" />}
              />
              <SocialLink
                href="https://github.com/I-harsh-kumar"
                label="GitHub"
                icon={<Github className="h-4 w-4 text-emerald" aria-hidden="true" />}
              />
              <SocialLink
                href="mailto:text2hk@gmail.com"
                label="Email"
                icon={<Mail className="h-4 w-4 text-emerald" aria-hidden="true" />}
              />
            </div>

            <div className="mt-8 border-t border-surfaceBorder/70 pt-4 text-xs text-textMuted">
              © 2026 Harsh Kumar. Built with React & Tailwind. Hosted on Vercel.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

