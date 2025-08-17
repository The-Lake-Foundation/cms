const getPossibleDirectories = (pagesArray) => {
    const directories = new Set()

    directories.add("/") // Always include root

    pagesArray.forEach((page) => {
        // Remove "/Page" suffix if present
        const cleanedLabel = page.label.replace(/\/?Page$/, "")

        // Skip empty labels (shouldn't happen with our normalization)
        if (!cleanedLabel) return

        // Normalize the path (ensure starts with /)
        const path = cleanedLabel.startsWith("/")
            ? cleanedLabel
            : `/${cleanedLabel}`

        // Split into segments
        const segments = path.split("/").filter(Boolean)
        let currentPath = "/"

        // Add each directory level
        for (let i = 0; i < segments.length; i++) {
            currentPath += segments[i]

            // For non-leaf nodes, add with trailing slash
            if (i < segments.length - 1) {
                directories.add(`${currentPath}/`)
                currentPath += "/"
            } else {
                directories.add(currentPath)
            }
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
