import styles from './how-we-deliver.module.css'

const STEPS = [
  { title: 'Project planning', points: ['Define scope & goals', 'Set key milestones'], crop: '85 600 175 190' },
  { title: 'Weekly reviews', points: ['Track site progress', 'Resolve issues early'], crop: '315 600 185 190' },
  { title: 'Leadership inspections', points: ['Twice-weekly MD visits', 'Check quality & progress'], crop: '535 600 250 190' },
  { title: 'Engineering-led sites', points: ['Expert supervision', 'Coordinate every detail'], crop: '840 600 170 190' },
  { title: 'Quality checks', points: ['Inspect every stage', 'Maintain high standards'], crop: '1060 600 310 190' },
  { title: 'On-time delivery', points: ['Proactive planning', 'Timely handover'], crop: '1400 600 180 190' },
] as const

// Reuse regions of one transparent illustration. All meaningful content is HTML.
function BlueprintArt({ viewBox, className }: { viewBox: string; className: string }) {
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  const clipId = `delivery-art-${x}-${y}`
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
      <image href="/images/delivery-blueprint.png" width="1672" height="941" clipPath={`url(#${clipId})`} />
    </svg>
  )
}

export function HowWeDeliver() {
  return (
    <section aria-labelledby="delivery-heading" className={`${styles.section} bg-background-alt px-4 py-12 sm:px-6 lg:px-8 lg:py-16`}>
      <div className={styles.blueprint}>
        <div className={styles.journey}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Our approach</p>
            <h2 id="delivery-heading" className={styles.title}>How we deliver</h2>
            <p className={styles.intro}>Plan strategically. Execute precisely.</p>
          </header>
          <BlueprintArt viewBox="0 35 1672 555" className={styles.road} />
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <h3 className={styles.stepTitle}>
                <span className={styles.number}>{index + 1}.</span>{step.title}
              </h3>
              <BlueprintArt viewBox={step.crop} className={styles.icon} />
              <ul className={styles.points}>
                {step.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <footer className={styles.footer}>
          <p className={styles.note}>Our Managing Director personally inspects<br className="hidden sm:block" /> every active site — twice a week.</p>
          <p className={styles.plate}>A six-step building journey</p>
          <div className={styles.stamp}>
            <div><span>Built by</span><strong>GP Builders</strong></div>
            <div><span>Our promise</span><strong>Quality &amp; value</strong></div>
            <svg viewBox="0 0 60 76" aria-hidden="true" className={styles.compass}>
              <text x="30" y="12" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10">N</text>
              <circle cx="30" cy="46" r="21" />
              <path d="M30 18 36 40 56 46 36 52 30 74 24 52 4 46 24 40Z M30 18V74 M4 46H56 M15 31 45 61 M45 31 15 61" />
            </svg>
          </div>
        </footer>
      </div>
    </section>
  )
}
