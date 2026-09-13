import { LEARN_TOPICS, getTopic } from '../data/learn.js'
import { Card, Link, Badge } from '../components/ui.jsx'
import { BookOpen, ArrowLeft } from 'lucide-react'

export function Learn() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900">Learn</h1>
      <p className="text-sm text-slate-500">Islamic investing fundamentals — educational content, not religious rulings.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_TOPICS.map(t => (
          <Link key={t.slug} to={`/learn/${t.slug}`}>
            <Card className="card-hover h-full p-5">
              <BookOpen className="mb-3 h-5 w-5 text-brand-600" />
              <h2 className="font-bold text-slate-900">{t.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.summary}</p>
              <div className="mt-3"><Badge tone="slate">{t.minutes} min read</Badge></div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function LearnArticle({ slug }) {
  const t = getTopic(slug)
  if (!t) return <Card className="p-10 text-center"><p className="font-bold">Article not found.</p><Link to="/learn" className="text-sm text-brand-700">← All topics</Link></Card>
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm font-bold text-brand-700"><ArrowLeft className="h-4 w-4" /> All topics</Link>
      <Card className="p-8">
        <h1 className="text-3xl font-extrabold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{t.minutes} min read · Educational content</p>
        <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
          {t.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-500">
          This article is general education. For rulings on your specific situation, consult a qualified Islamic finance scholar.
        </p>
      </Card>
    </div>
  )
}
