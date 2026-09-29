import type { CollectionConfig, Payload } from 'payload'

import { revalidate } from '@/lib/revalidate'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

/**
 * The address a project gets. Derived from the title rather than typed, so
 * there is one less field to fill in and no chance of the two disagreeing.
 */
const toSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Both pages read this collection, and both are served from cache, so an edit
// in the admin panel stays invisible until they are purged.
const DEPENDENT_PATHS = ['/projects', '/'] as const

function revalidateProjects(payload: Payload, slug?: string | null) {
  // The project's own page too, now that it has one. Without it an edit shows
  // on the listing straight away and on the project itself only after the next
  // deploy, which reads as the save having failed.
  const paths = slug ? [...DEPENDENT_PATHS, `/projects/${slug}`] : [...DEPENDENT_PATHS]
  return revalidate(payload, paths)
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
    defaultColumns: ['title', 'location', 'category', 'ongoing', 'featured', 'order'],
    group: 'Content',
    description:
      'Everything shown on the Projects page. Order controls the sequence; Featured makes a project span a larger tile.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        void revalidateProjects(req.payload, doc?.slug)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidateProjects(req.payload, doc?.slug)
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
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'The web address for this project, taken from the name above. Renaming a project changes it, and any link already shared will stop working.',
      },
      hooks: {
        // Rebuilt from the title on every save, including the first. Falling
        // back to the stored title matters for a partial update — changing only
        // the Featured checkbox sends no title, and without this the slug would
        // be cleared.
        beforeValidate: [
          ({ data, originalDoc, value }) => {
            const title = data?.title ?? originalDoc?.title
            return typeof title === 'string' && title.trim() ? toSlug(title) : value
          },
        ],
      },
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
      // The single disciplines come first: most projects are one of them, and
      // the combined options below are for jobs that genuinely span all three.
      //
      // These are a Postgres enum, so adding a value here is a schema change.
      // Adding one by hand is `alter type enum_projects_scope add value ...`;
      // it cannot be removed again, so nothing existing should ever be
      // renamed or dropped from this list without migrating the rows first.
      options: [
        'Architecture',
        'Interior Design',
        'Construction',
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
      // An upload field with hasMany renders a compact grid of thumbnails that
      // stays workable at twenty images. The array field this replaced gave
      // every image a full-height row, so a long gallery became a long scroll
      // with the pictures themselves barely visible.
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        // Hook for the grid layout in app/(payload)/custom.css. Scoped to this
        // field rather than every upload, so a future single-image field keeps
        // Payload's default row.
        className: 'gallery-grid',
        description:
          'Extra images for the detail modal, shown after the main one. Drag to reorder. Leave empty to show only the card image.',
      },
    },
    {
      name: 'ongoing',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Still on site. Shows an "Ongoing" marker on the card so a visitor can tell it apart from finished work.',
      },
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
