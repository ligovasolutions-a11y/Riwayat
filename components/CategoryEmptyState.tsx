import Link from 'next/link'

export default function CategoryEmptyState({
  backHref,
  backLabel,
}: {
  backHref: string
  backLabel: string
}) {
  return (
    <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-xl mx-auto text-center py-16 lg:py-24">
      <p className="section-label mb-4">Coming Soon</p>
      <h2 className="luxury-heading text-2xl lg:text-4xl text-rw-black leading-tight mb-6">
        No products available yet
      </h2>
      <p className="text-rw-gray font-sans font-light text-base max-w-md mx-auto mb-10 leading-relaxed">
        We're still curating this selection. Check back soon, or speak to our team for a personal recommendation.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href={backHref} className="btn-dark">{backLabel}</Link>
        <Link href="/appointments" className="btn-outline-gold">Book a Consultation</Link>
      </div>
    </section>
  )
}
