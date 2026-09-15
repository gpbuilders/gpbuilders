import type { CollectionConfig, Payload } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

// Words per minute used to estimate reading time. 200 is the usual figure for
// adults reading prose on a screen.
const WPM = 200

/**
 * Turn a headline into a URL segment. Deliberately lossy — anything that is not
 * a letter, digit or space becomes a hyphen — so an em dash or an ampersand in
 * a title cannot produce a slug that needs escaping.
 */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Lexical stores the body as a tree of nodes, with the prose spread across
 * `text` properties at arbitrary depth. Walking it is the only way to get a
 * word count; there is no flat representation to read.
 */
function countWords(node: unknown): number {
  if (!node || typeof node !== 'object') return 0

  const record = node as Record<string, unknown>
  let total = 0

  if (typeof record.text === 'string') {
    const words = record.text.trim()
    if (words) total += words.split(/\s+/).length
  }

  if (Array.isArray(record.children)) {
    for (const child of record.children) total += countWords(child)
  }

  if (record.root) total += countWords(record.root)

  return total
}

// Both the list and the article itself are statically rendered, so an edit in
// the admin panel stays invisible until they are revalidated.
async function revalidatePost(payload: Payload, slug?: string) {
  try {
    const { revalidatePath } = await import('next/cache')
    const paths = ['/resources', ...(slug ? [`/resources/${slug}`] : [])]
    for (const path of paths) {
      revalidatePath(path)
    }
    payload.logger.info(`Revalidated ${paths.join(', ')}`)
  } catch {
    payload.logger.warn('Skipped revalidation (no Next.js cache in this context)')
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Blog',
  },
  access: {
    // Drafts are excluded from public reads. Without this, an unpublished post
    // is served to anyone who requests it over REST or guesses its URL.
    read: ({ req: { user } }) =>
      user ? true : { _status: { equals: 'published' } },
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Content',
    description:
      'Articles on the Resources page. Save a draft while you work on it; nothing is public until you hit Publish.',
  },
  // Newest first, matching how the page itself is ordered.
  defaultSort: '-publishedAt',
  versions: {
    drafts: {
      // A post being written is not a post being published. The two buttons
      // this enables are the whole reason drafts are on.
      autosave: false,
    },
    // Enough history to undo a bad edit without the table growing forever.
    maxPerDoc: 20,
  },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        void revalidatePost(req.payload, doc?.slug)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidatePost(req.payload, doc?.slug)
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline, shown on the card and at the top of the article.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'The web address: /resources/your-slug. Filled in from the title when you first save. Change it only if you have to — an existing link to the old one stops working.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Only derive the slug when the field is empty, so an intentional
            // edit survives every later save of the title.
            const source = typeof value === 'string' && value.trim() ? value : data?.title
            return typeof source === 'string' ? slugify(source) : value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        rows: 3,
        description:
          'One or two sentences, shown on the card. Capped at 200 characters so it cannot overflow the tile.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'architecture',
          options: [
            { label: 'Architecture', value: 'architecture' },
            { label: 'Design', value: 'design' },
            { label: 'Sustainability', value: 'sustainability' },
            { label: 'Innovation', value: 'innovation' },
            { label: 'Projects', value: 'projects' },
            { label: 'News', value: 'news' },
          ],
          admin: {
            width: '50%',
            description: 'Shown as the label above the headline on the card.',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Give this post a wide tile in the grid.',
          },
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'The card background and the banner on the article. Landscape crops best.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'The article itself.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'The date shown on the post, and what the list is sorted by.',
      },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'GP Builders',
      admin: {
        position: 'sidebar',
        description: 'Change this only for a guest byline.',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Minutes, worked out from the length of the article when you save.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const words = countWords(siblingData?.content)
            // A one-paragraph note should still say "1 min read", not "0".
            return Math.max(1, Math.round(words / WPM))
          },
        ],
      },
    },
  ],
}
