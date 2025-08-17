export function normalizeSlug(slug) {
    if (!slug) return "/"

    // Ensure starts with slash
    if (!slug.startsWith("/")) slug = `/${slug}`

    // Remove trailing slashes
    slug = slug.replace(/\/+$/, "")

    return slug || "/"
}
