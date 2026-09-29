import type { Payload } from 'payload'

/**
 * Tells Next to throw away its cached copy of the given paths.
 *
 * Every public page is served from cache and rebuilt at most once a minute
 * (see the `revalidate` export in the frontend layout). That minute is only a
 * backstop: this is what makes an edit in the admin appear within seconds
 * instead, by purging the saved copy the moment the document changes.
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
