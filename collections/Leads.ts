import type { CollectionConfig } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  access: {
    // Every operation requires a logged-in user, creation included. Public
    // submissions come through the server action in app/(frontend)/contact,
    // which uses the Local API and bypasses access control deliberately —
    // so there is no unauthenticated REST endpoint here to spam or scrape.
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'projectType', 'status', 'createdAt'],
    group: 'Enquiries',
    description:
      'Everyone who has submitted the contact form. Newest first. Update the status as you work through them.',
    components: {
      // Same component as the dashboard widget: the counts are as useful here,
      // where each card filters the very list you are looking at.
      beforeList: ['/components/payload/widgets/EnquiryStats#EnquiryStats'],
    },
  },
  // The list is worked from the top, so the newest enquiry should be there.
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%' } },
        {
          name: 'projectType',
          type: 'select',
          // Mirrors the options in components/contact-form.tsx.
          options: [
            { label: 'Residential', value: 'residential' },
            { label: 'Commercial', value: 'commercial' },
            { label: 'Interiors Only', value: 'interiors' },
            { label: 'Landscape', value: 'landscape' },
            { label: 'Consultation', value: 'consultation' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { rows: 6 },
    },
    {
      name: 'project',
      type: 'text',
      label: 'Came from project',
      admin: {
        readOnly: true,
        description:
          'Set automatically when the enquiry started from "Discuss Similar Project" on a project.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Won', value: 'won' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Where this enquiry has got to.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal notes',
      admin: {
        position: 'sidebar',
        description: 'Only ever visible here — never shown on the website.',
      },
    },
  ],
}
