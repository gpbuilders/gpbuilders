import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'

/**
 * Renders the Lexical document stored on a post.
 *
 * Every element comes out unstyled, so the `.article-body` block in globals.css
 * does the typography — headings, lists, links and quotes at the site's own
 * scale. That is a couple of dozen lines of CSS against pulling in
 * @tailwindcss/typography and then overriding its defaults to match.
 */
export function ArticleBody({ content }: { content: Post['content'] }) {
  return <RichText data={content} className="article-body" />
}
