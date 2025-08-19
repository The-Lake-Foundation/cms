const getPossibleDirectories = (pagesArray) => {
    const directories = new Set()

    directories.add("/") // Always include root

    pagesArray.forEach((page) => {
        // Remove "/Page" suffix if present
        const cleanedLabel = page.label.replace(/\/?Page$/, "")

        // Skip empty labels
        if (!cleanedLabel) return

        // Normalize the path (ensure it starts with /)
        const path = cleanedLabel.startsWith("/")
            ? cleanedLabel
            : `/${cleanedLabel}`

        // Split into segments
        const segments = path.split("/").filter(Boolean)
        let currentPath = ""

        // Add each directory level with a trailing slash
        for (const segment of segments) {
            currentPath += `/${segment}`
            directories.add(`${currentPath}/`)
        }
    })

    return Array.from(directories).sort()
}

export async function getPages(cms, col, column = "slug") {
    const contents = cms.initContent()
    const collection = contents.collections[col]
    const documents = await Array.fromAsync(collection)

    return getPossibleDirectories(documents)
}
