import Image from 'next/image'
import { BRANDS, getBrandLogo } from '@/lib/brand-logos'
import styles from './brands-we-build.module.css'

const ROW_CLASSES = [styles.rowA, styles.rowB, styles.rowC]

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

export function BrandsWeBuild() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Brands We Build With
          </h2>
          <p className="mt-3 text-muted-foreground">
            Premium materials from world-class partners
          </p>
        </div>
      </div>

      {/* Deliberately outside the container: the rows should run past the
          edges of the screen, which is where the mask fades them out. */}
      <div className={styles.viewport}>
        {rows.map((brands, index) => (
          <div key={ROW_CLASSES[index]} className={`${styles.row} ${ROW_CLASSES[index]}`}>
            <ul className={styles.group}>
              {brands.map((brand) => (
                <BrandTile key={brand} brand={brand} />
              ))}
            </ul>
            {/* The second copy is what makes the loop seamless. It is the same
                logos over again, so it is hidden from assistive tech. */}
            <ul className={styles.group} aria-hidden="true">
              {brands.map((brand) => (
                <BrandTile key={brand} brand={brand} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
