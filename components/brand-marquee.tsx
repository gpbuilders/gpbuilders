import Image from 'next/image'
import { BRANDS, getBrandLogo } from '@/lib/brand-logos'

// Plain global classes, defined in globals.css. They were a CSS module until
// the module's 1.4 KB bought itself a render-blocking <link> of its own for a
// section six screens down the page; globals.css is already in flight.
const ROW_CLASSES = ['marquee-row-a', 'marquee-row-b', 'marquee-row-c']

/**
 * Dealt round-robin rather than sliced into three blocks. Sliced, the wide
 * wordmarks cluster and one row comes out much longer than the others — and
 * since each row takes a fixed time to travel its own length, a longer row
 * moves faster. Dealing them out keeps the three lengths close, so the speeds
 * stay close too.
 */
const rows = ROW_CLASSES.map((_, row) =>
  BRANDS.filter((_, index) => index % ROW_CLASSES.length === row),
)

function BrandTile({ brand }: { brand: string }) {
  const logo = getBrandLogo(brand)
  return (
    <li className="flex h-20 w-44 shrink-0 items-center justify-center rounded-lg border border-border bg-card px-4 transition-colors hover:border-primary/50 sm:h-24 sm:w-56 sm:px-6">
      {logo ? (
        <Image
          src={logo.src}
          alt={`${brand} logo`}
          width={logo.width}
          height={logo.height}
          className="max-h-8 w-auto max-w-[110px] object-contain"
        />
      ) : (
        <span className="text-center text-sm font-semibold text-foreground">{brand}</span>
      )}
    </li>
  )
}

/**
 * The brand wall, as three rows that scroll themselves.
 *
 * Render it outside the page container: the rows are meant to run past the
 * edges of the screen, which is where the mask fades them out. Stopping them
 * at the container edge reads as content cut off rather than content flowing.
 */
export function BrandMarquee({ className }: { className?: string }) {
  return (
    <div className={className ? `marquee-viewport ${className}` : 'marquee-viewport'}>
      {rows.map((brands, index) => (
        <div key={ROW_CLASSES[index]} className={`marquee-row ${ROW_CLASSES[index]}`}>
          <ul className="marquee-group">
            {brands.map((brand) => (
              <BrandTile key={brand} brand={brand} />
            ))}
          </ul>
          {/* The second copy is what makes the loop seamless. It is the same
              logos over again, so it is hidden from assistive tech. */}
          <ul className="marquee-group" aria-hidden="true">
            {brands.map((brand) => (
              <BrandTile key={brand} brand={brand} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
