import type { Payload } from 'payload'

/**
 * Tells Next to throw away its cached copy of the given paths.
 *
 * This comment used to say every page was served from cache and rebuilt once
 * a minute, pointing at a `revalidate` export in the frontend layout. That
 * export is gone — the layout is force-dynamic and every page is rendered per
 * request — so there has been no rendered page for this to purge for some
 * time. It is kept because it costs nothing, does the right thing if route
 * caching ever comes back, and removing it would be a second change to reason
 * about on the day it does.
 *
 * The purge that matters now is revalidateTags below, which clears the
 * database reads the pages are built from.
 *
 * `revalidatePath` is imported lazily and the whole thing is guarded, because
 * the same config is loaded by the Payload CLI for seeding and migrations,
 * where there is no Next.js cache to talk to and the import throws.
 */
export async function revalidate(payload: Payload, paths: readonly string[]) {
  if (paths.length === 0) return

  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of paths) {
      revalidatePath(path)
    }
    payload.logger.info(`Revalidated ${paths.join(', ')}`)
  } catch {
    payload.logger.warn('Skipped revalidation (no Next.js cache in this context)')
  }
}

/**
 * Drops the cached database reads carried under these tags.
 *
 * Separate from revalidatePath above, and both are needed, because they clear
 * different things. revalidatePath throws away a rendered page; this throws
 * away the query result the page was rendered from. Purge only the path and
 * the page is rebuilt from the same stale rows.
 *
 * One important limit, which is why lib/cached-content.ts also sets an
 * interval: this clears the cache of the container it runs in. Amplify runs
 * the site on Lambda, every container keeps its own copy, and a container
 * that was serving a visitor while the editor hit save never hears about it.
 * That one serves its existing copy until the interval expires.
 */
export async function revalidateTags(payload: Payload, tags: readonly string[]) {
  if (tags.length === 0) return

  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tags) {
      // 'max' is the strongest purge Next 16 offers: drop the entry whatever
      // its age. Called with one argument it warns and is deprecated, and
      // updateTag — the other option it suggests — may only be called from a
      // Server Action, which a Payload hook is not.
      revalidateTag(tag, 'max')
    }
    payload.logger.info(`Dropped cached reads: ${tags.join(', ')}`)
  } catch {
    payload.logger.warn('Skipped cache purge (no Next.js cache in this context)')
  }
}

/**
 * Purges every page on the site.
 *
 * For documents whose reach cannot be worked out from the document itself. An
 * image in the Media library is pointed at by a project's card and gallery, a
 * post's cover, and four fields on the Hero Media global — so replacing one
 * can change literally any page, and finding out which would mean querying
 * every collection that references it on every save.
 *
 * `revalidatePath('/', 'layout')` invalidates the root layout and everything
 * nested under it, which is the whole frontend in one call. Heavy-handed by
 * design, and cheap in practice: media is edited rarely, and the cost is that
 * each page rebuilds once on its next visit.
 */
export async function revalidateEverything(payload: Payload) {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    payload.logger.info('Revalidated every page (media changed)')
  } catch {
    payload.logger.warn('Skipped revalidation (no Next.js cache in this context)')
  }
}
