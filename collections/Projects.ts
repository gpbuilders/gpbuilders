import type { CollectionConfig, Payload } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

// Both pages read this collection and both are statically rendered, so an edit
// in the admin panel stays invisible until they are revalidated.
const DEPENDENT_PATHS = ['/projects', '/'] as const

/**
 * Imported lazily and guarded because the same config is loaded by the Payload
 * CLI (seeding, migrations), where there is no Next.js cache to revalidate.
 */
async function revalidateProjects(payload: Payload) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of DEPENDENT_PATHS) {
      revalidatePath(path)
    }
    payload.logger.info(`Revalidated ${DEPENDENT_PATHS.join(', ')}`)
  } catch {
    payload.logger.warn('Skipped revalidation (no Next.js cache in this context)')
  }
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'category', 'featured', 'order'],
    group: 'Content',
    description:
      'Everything shown on the Projects page. Order controls the sequence; Featured makes a project span a larger tile.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        void revalidateProjects(req.payload)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidateProjects(req.payload)
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          required: true,
          admin: { width: '50%', placeholder: 'Chennai' },
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'residential',
          options: [
            { label: 'Residential', value: 'residential' },
            { label: 'Commercial', value: 'commercial' },
          ],
          admin: {
            width: '50%',
            description: 'Which filter tab the project appears under.',
          },
        },
      ],
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        'Architecture + Interior + Construction',
        'Architecture + Construction',
        'Interior Design + Construction',
        'Landscape + Construction',
      ].map((value) => ({ label: value, value })),
      admin: {
        description: 'Shown as the pill on the project card.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Shown in the detail modal. Two or three sentences works best.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The card image. Landscape crops best.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      admin: {
        description:
          'Extra images for the detail modal. Leave empty to show only the card image.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Span a larger tile in the grid.',
          },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '50%',
            step: 1,
            description: 'Lower numbers appear first.',
          },
        },
      ],
    },
  ],
}
