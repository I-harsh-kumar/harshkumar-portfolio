import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Twitter } from 'lucide-react'

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

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function useSmoothScroll() {
  useEffect(() => {
    const styleId = 'scroll-behavior-smooth'
    if (document.getElementById(styleId)) return
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = 'html{scroll-behavior:smooth}'
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])
}

function UnderlineNavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 rounded-md"
    >
      <span className="inline-block">{children}</span>
      <span className="mt-1 block h-[1px] w-0 bg-emerald/70 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
    </a>
  )
}

function TechTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md border border-surfaceBorder/70 bg-bg px-2 py-0.5 font-mono text-[11px] text-textMuted"
      style={{ letterSpacing: '0.02em' }}
    >
      {label}
    </span>
  )
}

function SocialIconLink({
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
      className="group inline-flex items-center gap-3 rounded-lg border border-surfaceBorder/70 bg-surface/0 px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
      aria-label={label}
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-surfaceBorder/70 bg-surface/20 transition group-hover:bg-surface/30"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="hidden sm:inline font-medium tracking-wide">{label}</span>
      <span className="ml-auto h-px w-8 bg-emerald opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </a>
  )
}

type Project = {
  id: string
  category: string
  year: string
  title: string
  tagline: string
  tags: string[]
  github: string
  live: string
}

export default function App() {
  useSmoothScroll()

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
          'A pragmatic checklist: isolate dependency graphs, prune cache keys, tune build parallelism, and enforce deterministic build steps—keeping releases fast without sacrificing reliability.',
        dateISO: '2026-03-14',
        readMins: 7
      },
      {
        id: 'blog-2',
        category: 'Design',
        title: 'From Figma to Production: Maintaining Design System Integrity',
        description:
          'How to preserve semantic tokens through implementation—aligning typography, spacing, and interaction states to eliminate drift between prototypes and shipped components.',
        dateISO: '2026-02-02',
        readMins: 6
      },
      {
        id: 'blog-3',
        category: 'Frontend',
        title: 'Architecting High-Throughput Web Applications with Redis and Node.js',
        description:
          'Latency-first architecture: cache-aside patterns, safe concurrency, background invalidation, and instrumentation to keep predictable performance under real load.',
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

  const projects: Project[] = useMemo(
    () => [
      {
        id: 'prj-1',
        category: 'Hackathon Winner',
        year: '2025',
        title: 'ByteRush — Edge Observability for Full-Stack Apps',
        tagline: 'A unified telemetry pipeline correlating frontend events with backend traces for faster debugging.',
        tags: ['React', 'TypeScript', 'Node.js', 'Redis', 'CI/CD'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      },
      {
        id: 'prj-2',
        category: 'Full-Stack Dev',
        year: '2024',
        title: 'DesignOps Platform — Design System to Runtime Sync',
        tagline: 'Token automation with PR-enforced UI consistency to reduce drift across releases.',
        tags: ['Figma', 'Tailwind CSS', 'React', 'PostgreSQL', 'GitHub Actions'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      },
      {
        id: 'prj-3',
        category: 'Automation',
        year: '2026',
        title: 'Cloud Engine Scripts — Deployment Reliability Kit',
        tagline: 'Deterministic build pipelines with rollback-safe deploy steps for production stability.',
        tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/GCP', 'Nginx'],
        github: 'https://github.com/I-harsh-kumar',
        live: 'https://vercel.com'
      }
    ],
    []
  )

  const funFacts = useMemo(
    () => [
      { k: 'Turning edge into code', v: 'Debugging is design—constraints become interfaces.' },
      { k: 'Structural order', v: 'Systems thinking over random iteration.' },
      { k: 'Fast feedback loops', v: 'Instrumentation and guardrails that ship.' }
    ],
    []
  )

  const techBento = useMemo(
    () => [
      {
        title: 'Design & Prototyping',
        subtitle: 'Wireframing → Prototypes → Systems',
        blocks: ['Wireframing', 'Figma', 'User Flows', 'Prototyping']
      },
      {
        title: 'Languages & Systems',
        subtitle: 'From kernels to tooling',
        blocks: ['C / C++', 'Python', 'Java', 'Go', 'Bash']
      },
      {
        title: 'Full-Stack Web Architecture',
        subtitle: 'Interfaces + architecture',
        blocks: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Database Architecture']
      },
      {
        title: 'DevOps, Cloud & Automation',
        subtitle: 'Reliability engineered',
        blocks: ['CI/CD Pipelines', 'Vercel Deploy', 'Docker', 'Kubernetes', 'Nginx', 'Linux']
      }
    ],
    []
  )

  const blogCategories: BlogCategory[] = ['All', 'DevOps', 'Frontend', 'Design']

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

  return (
    <div className="min-h-screen bg-bg text-textPrimary [scrollbar-gutter:stable]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-textPrimary focus:ring-2 focus:ring-emerald/60"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-surfaceBorder/70 bg-bg/60 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Primary">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-surfaceBorder/70 bg-surface/20 shadow-glass" aria-hidden="true">
              <Sparkles className="h-4 w-4 text-emerald" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Harsh Kumar</div>
              <div className="text-xs text-textMuted">// BytePhantom</div>
            </div>

            <div className="ml-3 hidden md:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-surfaceBorder/80 bg-surface/20 px-3 py-1 text-[11px] text-textMuted">
                <span
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full',
                    status ? (status.ok ? 'bg-emerald' : 'bg-indigo') : 'bg-surfaceBorder'
                  )}
                  aria-hidden="true"
                />
                API:{' '}
                <span className="text-textPrimary">{status ? (status.ok ? 'Online' : 'Offline') : 'Checking…'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 md:flex" role="navigation" aria-label="Sections">
              <UnderlineNavLink href="#about">About</UnderlineNavLink>
              <UnderlineNavLink href="#expertise">Expertise</UnderlineNavLink>
              <UnderlineNavLink href="#projects">Projects</UnderlineNavLink>
              <UnderlineNavLink href="#blogs">Blogs</UnderlineNavLink>
              <UnderlineNavLink href="#contact">Contact</UnderlineNavLink>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-transparent px-4 py-2 text-sm font-medium text-textPrimary transition hover:border-emerald/40 hover:bg-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
            >
              Resume <ArrowRight className="h-4 w-4 text-emerald" aria-hidden="true" />
            </a>
          </div>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4">
        <section className="pb-14 pt-12 sm:pt-16 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-surfaceBorder/70 bg-surface/20 px-4 py-2 text-xs text-textMuted">
                <span className="text-emerald" aria-hidden="true">⚡</span>
                <span className="font-medium tracking-wide text-textPrimary">UI/UX Designer • Full-Stack Dev • DevOps Engineer</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tighter sm:text-6xl">
                Engineering scalable systems with user-first design.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-textMuted tracking-wide">
                Turning edge into code, chasing bugs, and breaking things (just to fix them later). From hackathon-winning UI/UX to full-stack architecture, I build interfaces that feel instant and systems that ship reliably. Then I automate infrastructure and CI/CD so products scale with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="#projects"
                  className="group inline-flex items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 px-5 py-3 text-sm font-semibold text-textPrimary transition hover:border-emerald/50 hover:bg-emerald/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                >
                  View Projects
                </a>

                <a
                  href="#blogs"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 rounded-md"
                >
                  <span className="tracking-wide">Explore Engineering Works →</span>
                  <span className="relative inline-flex">
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-emerald/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative">Read Articles</span>
                  </span>
                </a>

                {statusError ? (
                  <div className="text-xs text-emerald/90" role="status" aria-live="polite">API error: {statusError}</div>
                ) : null}
              </div>
            </div>

            <aside className="hidden lg:block" aria-label="Highlights">
              <div className="rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-6">
                <div className="text-xs font-medium tracking-wide text-textMuted">Highlights</div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-semibold tracking-wide">Minimal UI, maximum signal</div>
                      <div className="mt-1 text-sm text-textMuted tracking-wide">Razor-thin focus states, calm surfaces, typography-forward hierarchy.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo/80" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-semibold tracking-wide">Engineering reliability</div>
                      <div className="mt-1 text-sm text-textMuted tracking-wide">Instrumentation, deterministic builds, release-safe CI/CD.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-semibold tracking-wide">Product-first implementation</div>
                      <div className="mt-1 text-sm text-textMuted tracking-wide">Design intent translated into constraints, not compromises.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-surfaceBorder/70 pt-4">
                  <div className="text-xs font-medium tracking-wide text-textMuted">Micro-details</div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="font-mono text-[11px] text-textMuted">underline-on-hover</span>
                    <span className="font-mono text-[11px] text-textMuted">focus-ring-emerald</span>
                    <span className="font-mono text-[11px] text-textMuted">thin-border-hierarchy</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="about" className="pb-14" aria-labelledby="about-title">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="text-xs font-medium tracking-wide text-textMuted">About</div>
              <h2 id="about-title" className="mt-3 text-2xl font-semibold tracking-tight">Kernels to cloud apps, with structural order.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-textMuted tracking-wide">
                I build everything from low-level systems to cloud platforms, then translate that rigor into premium, user-first interfaces. Coffee keeps the curiosity alive—discipline keeps execution precise.
              </p>

              <div className="mt-7">
                <div className="text-xs font-medium tracking-wide text-textMuted">Fun Facts</div>
                <div className="mt-4 space-y-3">
                  {funFacts.map((f) => (
                    <div key={f.k} className="rounded-xl border border-surfaceBorder/70 bg-surface/0 p-4 transition hover:bg-surface/10">
                      <div className="text-sm font-semibold tracking-wide">{f.k}</div>
                      <div className="mt-1 text-sm text-textMuted tracking-wide">{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="expertise">
              <div className="text-xs font-medium tracking-wide text-textMuted">Tech Playground</div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-6">
                <div className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold tracking-wide">Design & Prototyping</div>
                      <div className="mt-1 text-sm text-textMuted tracking-wide">Wireframing → Prototypes → Systems</div>
                    </div>
                    <div className="h-px w-10 bg-emerald/70" aria-hidden="true" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techBento[0].blocks.map((t) => (
                      <TechTag key={t} label={t} />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 lg:row-span-2 rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5">
                  <div className="text-sm font-semibold tracking-wide">Languages & Systems</div>
                  <div className="mt-1 text-sm text-textMuted tracking-wide">From kernels to tooling</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techBento[1].blocks.map((t) => (
                      <TechTag key={t} label={t} />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5">
                  <div className="text-sm font-semibold tracking-wide">Full-Stack Web Architecture</div>
                  <div className="mt-1 text-sm text-textMuted tracking-wide">Interfaces + architecture that scale</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techBento[2].blocks.map((t) => (
                      <TechTag key={t} label={t} />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 lg:row-span-4 rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold tracking-wide">DevOps, Cloud & Automation</div>
                    <div className="h-px w-10 bg-emerald/70" aria-hidden="true" />
                  </div>
                  <div className="mt-1 text-sm text-textMuted tracking-wide">Reliability engineered</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techBento[3].blocks.map((t) => (
                      <TechTag key={t} label={t} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5">
                <div className="text-xs font-medium tracking-wide text-textMuted">Method</div>
                <div className="mt-2 text-sm leading-relaxed text-textMuted tracking-wide">
                  Design intent → implementation constraints → instrumentation → release-safe automation.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="pb-14" aria-labelledby="projects-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-medium tracking-wide text-textMuted">Projects</div>
              <h2 id="projects-title" className="mt-2 text-2xl font-semibold tracking-tight">Hackathon & engineering log</h2>
            </div>
            <div className="text-sm text-textMuted tracking-wide">Hover for subtle accent line.</div>
          </div>

          <div className="mt-6">
            <ol className="space-y-3" aria-label="Project list">
              {projects.map((p) => (
                <li key={p.id}>
                  <article className="rounded-2xl border border-surfaceBorder/70 bg-surface/0 transition hover:bg-surface/10" aria-label={p.title}>
                    <div className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-surfaceBorder/70 bg-surface/0 px-3 py-1 text-[11px] font-mono text-textMuted">{p.category}</span>
                            <span className="text-xs text-textMuted tracking-wide">{p.year}</span>
                          </div>
                          <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-textMuted tracking-wide">{p.tagline}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                              <TechTag key={t} label={t} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-bg px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary hover:border-emerald/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                            aria-label={`GitHub for ${p.title}`}
                          >
                            <Github className="h-4 w-4 text-emerald" aria-hidden="true" />
                            <span className="hidden sm:inline">GitHub</span>
                          </a>
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-surfaceBorder/70 bg-bg px-3 py-2 text-sm text-textMuted transition hover:text-textPrimary hover:border-emerald/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
                            aria-label={`Live demo for ${p.title}`}
                          >
                            <span className="hidden sm:inline">Live</span>
                            <ArrowRight className="h-4 w-4 text-emerald" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="h-px w-full bg-surfaceBorder/70 transition-colors group-hover:bg-emerald/60" aria-hidden="true" />
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="blogs" className="pb-14" aria-label="Blogs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-medium tracking-wide text-textMuted">Blogs</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">System-engine editorial list</h2>
            </div>
            <div className="text-sm text-textMuted tracking-wide">Filter by category.</div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6" role="tablist" aria-label="Blog category filter">
            {blogCategories.map((cat) => {
              const active = activeBlogCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveBlogCategory(cat)}
                  className={cn(
                    'group relative inline-flex items-center px-0 py-1 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60',
                    active ? 'text-textPrimary' : 'text-textMuted hover:text-textPrimary'
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px w-full bg-emerald transition-transform duration-200',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                    style={{ transformOrigin: 'left' }}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-3" aria-label="Blog articles">
            {filteredBlogs.map((b) => (
              <article key={b.id} className="rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-5 transition hover:bg-surface/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-surfaceBorder/70 bg-surface/0 px-3 py-1 text-[11px] font-mono text-textMuted">
                      {b.category}
                    </span>
                    <span className="text-xs text-textMuted tracking-wide">{formatDate(b.dateISO)}</span>
                    <span className="text-xs text-textMuted tracking-wide">• {b.readMins} min read</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-textMuted transition hover:text-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 rounded-md"
                    aria-label={`Read article: ${b.title}`}
                  >
                    <span className="hidden sm:inline">Read Article</span>
                    <ArrowRight className="h-4 w-4 text-emerald transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-textPrimary transition hover:text-textPrimary">
                    {b.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-textMuted tracking-wide">{b.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="pb-20" aria-label="Contact">
          <div className="rounded-2xl border border-surfaceBorder/70 bg-surface/0 p-8">
            <div className="max-w-2xl">
              <div className="text-xs font-medium tracking-wide text-textMuted">Contact</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Let's build something efficient.</h2>
              <p className="mt-3 text-sm leading-relaxed text-textMuted tracking-wide">
                Reach out directly or connect on social. I’m open to engineering, UI/UX, and DevOps collaboration.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <SocialIconLink href="https://linkedin.com/in/harsh-kumar-453a32236" label="LinkedIn" icon={<Linkedin className="h-4 w-4 text-emerald" aria-hidden="true" />} />
              <SocialIconLink href="https://twitter.com/@text2hk" label="Twitter/X" icon={<Twitter className="h-4 w-4 text-emerald" aria-hidden="true" />} />
              <SocialIconLink href="https://github.com/I-harsh-kumar" label="GitHub" icon={<Github className="h-4 w-4 text-emerald" aria-hidden="true" />} />
              <SocialIconLink href="mailto:text2hk@gmail.com" label="Email" icon={<Mail className="h-4 w-4 text-emerald" aria-hidden="true" />} />
            </div>

            <div className="mt-8 border-t border-surfaceBorder/70 pt-5 text-xs text-textMuted tracking-wide">
              © 2026 Harsh Kumar. Built with React & Tailwind. Hosted on Vercel.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

