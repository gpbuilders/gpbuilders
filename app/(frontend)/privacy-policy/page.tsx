import type { Metadata } from 'next'
import Link from 'next/link'

import { MinimalHero } from '@/components/minimal-hero'
import { LegalDocument, Term, type LegalSection } from '@/components/legal-document'

export const metadata: Metadata = {
  title: 'Privacy Policy | GP Builders',
  description:
    'How GP Builders collects, uses and protects personal data submitted through this website, under the Digital Personal Data Protection Act, 2023.',
}

/**
 * Written from what the site actually does rather than from a template.
 *
 * The enquiry form is the only place a visitor hands over anything, and
 * app/(frontend)/enquiry/route.ts is the authority on which fields reach the
 * database — if a field is added there, clause 2 has to change with it.
 * Likewise, there is deliberately no cookie-consent language here: the
 * frontend sets no cookies and stores nothing in the browser, and saying
 * otherwise to look thorough would be a false statement in a privacy notice.
 */
const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: (
      <>
        <p>
          GP Builders is an architecture, interior design and construction firm
          based in Tiruchirappalli, Tamil Nadu. In the language of the Digital
          Personal Data Protection Act, 2023, we are the{' '}
          <Term>Data Fiduciary</Term> for personal data collected through this
          website, and you are the <Term>Data Principal</Term>.
        </p>
        <address className="not-italic">
          GP Builders
          <br />
          17/4, G-3, Pushpak Nagar, Srirangam
          <br />
          Tiruchirappalli &ndash; 620006, Tamil Nadu, India
          <br />
          <a
            href="mailto:projects@gpbuildersgroup.com"
            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            projects@gpbuildersgroup.com
          </a>
          {' · '}
          <a
            href="tel:+919363699574"
            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            +91 93636 99574
          </a>
        </address>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: (
      <>
        <p>
          The enquiry form is the only place this website asks you for anything.
          When you submit it we record:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Term>Your name and email address</Term>, and the message you write.
            These are required, because they are how we reply.
          </li>
          <li>
            <Term>Your phone number</Term>, if you choose to give one.
          </li>
          <li>
            <Term>The kind of project</Term> you selected &mdash; residential,
            commercial, interiors, landscape or consultation.
          </li>
          <li>
            <Term>Which project page you came from</Term>, if you started the
            enquiry from one, so we know what caught your eye.
          </li>
        </ul>
        <p>
          Our team later adds a status and internal notes to your enquiry as we
          follow it up. Those notes are about the conversation, not about you.
        </p>
        <p>
          We do not ask for and do not store identity documents, payment card
          details, bank details or any financial information through this
          website. There is no visitor login, so no password of yours exists.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-collect',
    heading: 'Why we collect it, and your consent',
    body: (
      <>
        <p>
          We use what you send us for one purpose: to respond to your enquiry
          and, if it goes further, to discuss, quote and plan the work you asked
          about. Submitting the form is your consent for that, and the form says
          so at the point you submit it.
        </p>
        <p>
          We do not sell your details, rent them, or share them with anyone for
          their own marketing. We will not add you to a mailing list because you
          asked us a question.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and analytics',
    body: (
      <>
        <p>
          <Term>This website sets no cookies</Term> and stores nothing in your
          browser. There is no advertising network, no tracking pixel and no
          social media tracker on any page, which is why you are not being asked
          to dismiss a cookie banner.
        </p>
        <p>
          <Term>We run no analytics at all.</Term> No service counts your visit,
          measures which pages you read, or records how you move through the
          site. We know a page was served because our host logs the request, and
          that is the whole of it.
        </p>
        <p>
          Our hosting provider keeps standard server logs, including IP
          addresses, for security and troubleshooting. These are generated
          automatically by the infrastructure, are not linked to your enquiry
          and are not used to identify you.
        </p>
      </>
    ),
  },
  {
    id: 'who-sees-it',
    heading: 'Who else can see your data',
    body: (
      <>
        <p>
          Your enquiry is read by the GP Builders team. Beyond that, it passes
          through the service providers that run this website for us, each of
          which processes it only to provide that service:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Term>Amazon Web Services</Term> &mdash; website hosting and image
            storage.
          </li>
          <li>
            <Term>Supabase</Term> &mdash; the database your enquiry is stored
            in.
          </li>
        </ul>
        <p>
          We may also disclose data where the law requires it &mdash; for
          example, to a court or to a government authority acting under a valid
          legal power.
        </p>
      </>
    ),
  },
  {
    id: 'where-stored',
    heading: 'Where your data is stored',
    body: (
      <>
        <p>
          Our website and the images on it are hosted in India, in Amazon Web
          Services&rsquo; Mumbai region.
        </p>
        <p>
          <Term>Our database is currently hosted outside India</Term>, in
          Sydney, Australia. Enquiries you submit are therefore transferred to
          and stored on a server in Australia. We are telling you this plainly
          because you are entitled to know where your data goes, and we are
          working to move this database to India.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: (
      <>
        <p>
          We keep an enquiry for as long as it is useful to the conversation it
          started, and for as long afterwards as we are required to keep records
          of the work we did. Where an enquiry did not lead to a project, we
          remove it once it is clearly no longer live.
        </p>
        <p>
          You can ask us to erase your enquiry sooner. See clause 8.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights under the DPDP Act',
    body: (
      <>
        <p>
          The Digital Personal Data Protection Act, 2023 gives you rights over
          your personal data, and we will honour them:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Term>Access</Term> &mdash; ask what personal data of yours we hold
            and what we have done with it.
          </li>
          <li>
            <Term>Correction</Term> &mdash; have anything inaccurate,
            incomplete or out of date put right.
          </li>
          <li>
            <Term>Erasure</Term> &mdash; ask us to delete your data, unless we
            are required by law to keep it.
          </li>
          <li>
            <Term>Withdraw consent</Term> &mdash; at any time, and as easily as
            you gave it. We will stop processing, though this does not undo what
            was lawfully done beforehand.
          </li>
          <li>
            <Term>Nominate</Term> &mdash; name someone to exercise these rights
            on your behalf if you die or become incapacitated.
          </li>
          <li>
            <Term>Grievance redressal</Term> &mdash; complain to us first, as
            set out in clause 11.
          </li>
        </ul>
        <p>
          To exercise any of these, email{' '}
          <a
            href="mailto:projects@gpbuildersgroup.com"
            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            projects@gpbuildersgroup.com
          </a>
          . We may ask you to confirm your identity first, so that we do not
          hand your data to someone else.
        </p>
      </>
    ),
  },
  {
    id: 'photographs',
    heading: 'Photographs of completed projects',
    body: (
      <>
        <p>
          We photograph our finished work and publish it on this website, on
          social media and in printed material. This matters to you if you are a
          client, so it is worth being clear about.
        </p>
        <p>
          We publish photographs of the <Term>building and its interiors</Term>.
          We do not publish our clients&rsquo; names, door numbers or exact
          addresses alongside them &mdash; a project is identified by a general
          locality, such as Srirangam or Samayapuram. We do not photograph
          people, personal belongings or documents for publication.
        </p>
        <p>
          If you are a client and would prefer your project not to be published,
          or would like photographs already published to be taken down, tell us
          and we will remove them.
        </p>
      </>
    ),
  },
  {
    id: 'security-children',
    heading: 'Security, and children',
    body: (
      <>
        <p>
          The site is served over HTTPS, the database sits behind credentials
          held only by us, and access to enquiries is limited to the people who
          need it. No system is perfectly secure, and we do not claim otherwise;
          what we can say is that we take reasonable technical and
          organisational measures appropriate to the small amount of data
          involved.
        </p>
        <p>
          This website is meant for adults arranging building and design work.
          We do not knowingly collect data about anyone under 18. If you believe
          a child has sent us something, tell us and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: 'grievances',
    heading: 'Complaints and grievances',
    body: (
      <>
        <p>
          If you are unhappy with how we have handled your personal data, write
          to our Grievance Officer at{' '}
          <a
            href="mailto:projects@gpbuildersgroup.com"
            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            projects@gpbuildersgroup.com
          </a>{' '}
          or by post to the address in clause 1, marking it for the attention of
          the Grievance Officer. We will acknowledge your complaint and respond
          within the time the law allows.
        </p>
        <p>
          If we do not resolve it to your satisfaction, you may escalate the
          matter to the Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <>
        <p>
          We will update this page when what we do changes &mdash; for instance,
          when our database moves to India. The date at the top always reflects
          the current version. Material changes will be summarised here rather
          than made quietly.
        </p>
        <p>
          This policy sits alongside our{' '}
          <Link
            href="/terms"
            className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <MinimalHero
        background="alt"
        title="Privacy"
        subtitle="Policy"
        description="What we collect when you contact us, why we collect it, where it is kept, and the rights you have over it under Indian law."
      />
      <LegalDocument
        updated={{ label: '10 October 2026', iso: '2026-10-10' }}
        intro={
          <p>
            This policy explains how GP Builders handles personal data collected
            through gpbuildersgroup.com. It is written to be read, not to be
            skimmed past &mdash; if anything here is unclear, ask us and we will
            explain it.
          </p>
        }
        sections={SECTIONS}
      />
    </>
  )
}
