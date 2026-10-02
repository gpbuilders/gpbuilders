import type { Metadata } from 'next'
import Link from 'next/link'

import { MinimalHero } from '@/components/minimal-hero'
import { LegalDocument, Term, type LegalSection } from '@/components/legal-document'

export const metadata: Metadata = {
  title: 'Terms & Conditions | GP Builders',
  description:
    'The terms on which GP Builders makes this website available, how estimates and project photographs should be read, and the law that governs them.',
}

/**
 * These terms cover the website, not the building work.
 *
 * That distinction runs through the whole document and is the point of clause
 * 3: the contract for a project is signed on paper, and nothing a visitor
 * reads here should be capable of varying it. Clause 6 exists because the home
 * and projects pages display 43 third-party brand marks (see lib/brand-logos.ts)
 * — showing a manufacturer's logo states which materials get used, and must not
 * be read as that manufacturer endorsing or partnering with GP Builders.
 */
const SECTIONS: LegalSection[] = [
  {
    id: 'about',
    heading: 'Who these terms are from',
    body: (
      <>
        <p>
          This website, gpbuildersgroup.com, is operated by GP Builders, an
          architecture, interior design and construction firm at 17/4, G-3,
          Pushpak Nagar, Srirangam, Tiruchirappalli &ndash; 620006, Tamil Nadu.
          In these terms, <Term>we</Term> and <Term>us</Term> mean GP Builders,
          and <Term>you</Term> means anyone using the site.
        </p>
        <p>
          By using the site you accept these terms. If you do not accept them,
          please do not use it.
        </p>
      </>
    ),
  },
  {
    id: 'what-this-site-is',
    heading: 'What this website is, and is not',
    body: (
      <>
        <p>
          This site describes the services we offer and shows work we have
          completed. It is information and marketing material.
        </p>
        <p>
          <Term>Nothing on this site is an offer capable of acceptance</Term>,
          and nothing on it forms a contract. Statements about our approach,
          quality or value &mdash; including our line &ldquo;Quality at an
          Affordable Price&rdquo; &mdash; describe how we work. They are not
          contractual guarantees, and they are not specifications.
        </p>
        <p>
          Nothing here is professional architectural, structural, legal or
          financial advice for your particular site or building. Advice for your
          project comes from us in writing, for that project, after we have seen
          it.
        </p>
      </>
    ),
  },
  {
    id: 'the-agreement',
    heading: 'The project agreement governs the work',
    body: (
      <>
        <p>
          Any work we do for you is governed by a separate written agreement
          signed by both of us, covering scope, drawings, specifications, stage
          payments, timelines and everything else that matters.
        </p>
        <p>
          Where anything on this website differs from that agreement,{' '}
          <Term>the agreement prevails</Term>. These terms govern your use of
          the website only, and cannot vary a contract for building work.
        </p>
      </>
    ),
  },
  {
    id: 'estimates',
    heading: 'Estimates, quotations and pricing',
    body: (
      <>
        <p>
          Any figure given before a site visit is indicative. A firm quotation
          follows a site survey and an agreed scope, and depends on things we do
          not control: soil and site conditions, the levels and access at your
          plot, prevailing material and labour rates, your choice of
          specification and finishes, and any change you ask for once work has
          begun.
        </p>
        <p>
          Unless a quotation says otherwise in so many words, amounts are{' '}
          <Term>exclusive of GST</Term> and of statutory fees, deposits and
          charges payable to any authority or utility.
        </p>
        <p>
          A quotation is open for the period stated on it. Material rates move,
          and a quotation that has lapsed will be revised rather than honoured
          at a stale price.
        </p>
      </>
    ),
  },
  {
    id: 'photographs',
    heading: 'Project photographs and descriptions',
    body: (
      <>
        <p>
          The photographs on this site are of projects we have actually
          completed. They are not renderings presented as finished work, and
          they are not stock photography.
        </p>
        <p>
          They are shown to illustrate our workmanship and style. They are{' '}
          <Term>not a specification for your project</Term>. Finishes,
          materials, fittings, dimensions and the brands used vary from one
          project to another according to what the client chose and what the
          budget allowed. Colour as it appears on your screen will differ from
          colour in a room.
        </p>
        <p>
          Scope labels such as &ldquo;Architecture + Interior +
          Construction&rdquo; describe what we did on that project. Project
          locations are given by locality.
        </p>
      </>
    ),
  },
  {
    id: 'brands',
    heading: 'Brand names shown on this site',
    body: (
      <>
        <p>
          We display the logos of manufacturers whose materials, fittings and
          finishes we commonly use &mdash; paints, plywood and laminates,
          hardware, sanitaryware, lighting, fans, windows and pipes.
        </p>
        <p>
          Every one of those names and logos is{' '}
          <Term>the trademark of its owner</Term>, used here only to identify
          the products concerned. Their presence does not mean the manufacturer
          endorses us, sponsors us, is affiliated with us, or has appointed us
          as a dealer or authorised partner. We make no representation on their
          behalf.
        </p>
        <p>
          Which brands are used on your project is settled in your specification,
          not by this page. Any manufacturer&rsquo;s warranty on a product is
          given by that manufacturer on its own terms, and we pass it through to
          you rather than granting it ourselves.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Drawings, designs and site content',
    body: (
      <>
        <p>
          The text, photographs, layout and design of this website belong to GP
          Builders or to the people who licensed them to us. You may read,
          print and share pages for your own non-commercial use. You may not
          republish them, sell them, or present our project photographs as your
          own work.
        </p>
        <p>
          Drawings, designs, 3D views and specifications we prepare for a
          project remain our intellectual property until the agreement for that
          project says otherwise and the fees for that stage have been paid. They
          are prepared for that site and that client, and are not to be reused
          on another site or handed to another contractor to build from without
          our written consent.
        </p>
      </>
    ),
  },
  {
    id: 'approvals',
    heading: 'Approvals and statutory compliance',
    body: (
      <>
        <p>
          Building work in Tamil Nadu requires planning permission and building
          approval from the competent local authority &mdash; the municipal
          corporation, municipality, town panchayat or development authority for
          your area &mdash; under the building rules in force, together with any
          further clearance your particular site needs.
        </p>
        <p>
          Where our agreement with you includes preparing and submitting
          drawings for approval, we will do that. Responsibility for{' '}
          <Term>clear title, possession and the legal status of the land</Term>{' '}
          rests with the owner, as does payment of statutory fees and charges.
          We do not warrant that any approval will be granted, or granted within
          a particular time, since that decision belongs to the authority.
        </p>
        <p>
          This website does not offer any plot, apartment, villa or built unit
          for sale. We provide design and construction services under contract
          with the owner of the property.
        </p>
      </>
    ),
  },
  {
    id: 'enquiries',
    heading: 'Enquiries you send us',
    body: (
      <>
        <p>
          When you use the enquiry form, please give us information that is
          accurate and your own to give. We will use it only to respond to you,
          as set out in our{' '}
          <Link
            href="/privacy-policy"
            className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          An enquiry does not create any obligation on either side. We may
          decline work, and you are free to go elsewhere. Please do not send
          confidential material through the form; wait until we are talking.
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    heading: 'Availability, accuracy and other websites',
    body: (
      <>
        <p>
          We try to keep this site accurate and available, but we do not promise
          that it will be uninterrupted, error-free, or current at every moment.
          We may change, add to or remove anything on it without notice, and may
          take it down for maintenance.
        </p>
        <p>
          Where we link to another website &mdash; a manufacturer, a social
          media profile &mdash; we do not control it and are not responsible for
          its content or its handling of your data.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <>
        <p>
          To the extent the law allows, we are not liable for any loss arising
          from your use of this website or from reliance on information
          published on it, including indirect or consequential loss, loss of
          profit, or loss arising from the site being unavailable.
        </p>
        <p>
          This clause limits our liability for the <Term>website</Term>. It does
          not limit our liability for the work we carry out for you &mdash; that
          is governed by your project agreement and by the law &mdash; and
          nothing here excludes liability that cannot lawfully be excluded,
          including for death or personal injury caused by negligence, or for
          fraud.
        </p>
      </>
    ),
  },
  {
    id: 'law',
    heading: 'Governing law and jurisdiction',
    body: (
      <>
        <p>
          These terms are governed by the laws of India.
        </p>
        <p>
          The courts at <Term>Tiruchirappalli, Tamil Nadu</Term> have exclusive
          jurisdiction over any dispute arising out of this website or these
          terms.
        </p>
        <p>
          Nothing in this clause affects any right you may have as a consumer to
          approach a consumer forum under the Consumer Protection Act, 2019.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: (
      <p>
        We may revise these terms from time to time. The version on this page is
        the one that applies, and the date at the top tells you when it last
        changed. Using the site after a change means you accept the revised
        terms.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <MinimalHero
        background="alt"
        title="Terms &"
        subtitle="Conditions"
        description="The terms on which we make this website available, how to read the estimates and photographs on it, and the law that governs them."
      />
      <LegalDocument
        updated={{ label: '2 October 2026', iso: '2026-10-02' }}
        intro={
          <p>
            These terms cover your use of gpbuildersgroup.com. They do not cover
            the building work itself &mdash; that is governed by the written
            agreement we sign with you for your project, which takes precedence
            over anything on this website.
          </p>
        }
        sections={SECTIONS}
      />
    </>
  )
}
