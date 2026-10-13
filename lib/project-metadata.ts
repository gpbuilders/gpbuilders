/**
 * Title and description for a project page, composed from the fields the
 * collection already holds.
 *
 * Not one project of the 33 has a description written, so every project page
 * was served the fallback — "Construction in Nagamangalam, Trichy by GP
 * Builders." That is a third of the length Google will show and it reads like
 * a database row rather than a sentence. The titles were as thin: "Balaji |
 * GP Builders" says nothing about what Balaji is or where it is.
 *
 * Composing instead of storing is deliberate. Two editable SEO fields would
 * have to be filled in by hand for all 33, and the empty description field on
 * every one of them is the evidence for how that goes. This way every project
 * gets a real title and description, including the next one somebody adds.
 * `description` on the record still wins when it is set, so a project worth
 * hand-writing can still be hand-written.
 */

/** "Nagamangalam, Trichy" -> "Trichy". The city is the last part. */
export function cityOf(location: string): string {
  const parts = location.split(',').map((part) => part.trim()).filter(Boolean)
  return parts.at(-1) ?? location.trim()
}

/**
 * "Architecture + Interior + Construction" -> "Architecture".
 *
 * The combined scopes are too long to sit in a title beside a project name and
 * a city, and the first one is the one the project led with.
 */
function leadScope(scope: string): string {
  return scope.split('+')[0]?.trim() ?? scope.trim()
}

/**
 * The richest title that fits in 60 characters, degrading rather than
 * overflowing. A name like "RPH 3rd floor and 4th floor" leaves no room for
 * the scope, and a truncated title in a search result is worse than a shorter
 * one that is whole.
 */
export function projectTitle(project: {
  title: string
  scope: string
  location: string
}): string {
  const city = cityOf(project.location)
  const scope = leadScope(project.scope)
  const candidates = [
    `${project.title} ${scope} in ${city} | GP Builders`,
    `${project.title} in ${city} | GP Builders`,
    `${project.title} | GP Builders`,
  ]
  return candidates.find((candidate) => candidate.length <= 60) ?? candidates.at(-1)!
}

/** The same idea for the description, against Google's ~155 character limit. */
export function projectDescription(project: {
  title: string
  scope: string
  location: string
  description?: string | null
}): string {
  if (project.description) return project.description

  const scope = leadScope(project.scope).toLowerCase()
  const candidates = [
    `Explore ${project.title} in ${project.location}. Browse GP Builders' ${scope} work on this project, with photographs and design details from the gallery.`,
    `Explore ${project.title} in ${project.location}. Browse GP Builders' ${scope} work, with project photographs and design details.`,
    `Explore ${project.title} in ${project.location} by GP Builders. Browse project photographs and design details.`,
    `${project.title} in ${project.location}, by GP Builders.`,
  ]
  return candidates.find((candidate) => candidate.length <= 155) ?? candidates.at(-1)!
}
