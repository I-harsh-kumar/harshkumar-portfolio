import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    service: 'portfolio-backend',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/blogs', (_req, res) => {
  res.json({
    ok: true,
    items: [
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
    ]
  })
})

app.get('/api', (_req, res) => {
  res.json({ ok: true })
})

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' })
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`)
})

