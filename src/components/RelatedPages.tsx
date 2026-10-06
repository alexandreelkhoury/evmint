import { Link } from 'react-router-dom'

interface RelatedPage {
  to: string
  title: string
  desc: string
}

interface RelatedPagesProps {
  heading?: string
  pages: RelatedPage[]
}

export default function RelatedPages({ heading = 'Related pages', pages }: RelatedPagesProps) {
  if (pages.length === 0) return null

  return (
    <section className="mt-12 mb-8" aria-labelledby="related-pages-heading">
      <h2 id="related-pages-heading" className="text-lg font-display font-bold text-white mb-4">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map(page => (
          <Link
            key={page.to}
            to={page.to}
            className="group block p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-colors"
          >
            <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
              {page.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">{page.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
