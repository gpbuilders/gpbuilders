export function BrandsWeBuild() {
  const brands = [
    'Kohler',
    'Hafele',
    'Godrej',
    'Dulux',
    'Saint Gobain',
    'Bosch',
    'Schüco',
    'Somany',
  ]

  return (
    <section className="bg-background-alt py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Brands We Build With
          </h2>
          <p className="mt-3 text-muted-foreground">
            Premium materials from world-class partners
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex items-center justify-center rounded-lg border border-border bg-card px-4 py-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <span className="font-semibold text-sm text-center text-foreground">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
