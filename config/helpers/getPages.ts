const getPossibleDirectories = (pagesArray) => {
    // Use a Set to automatically handle unique values.
    // This is a key performance optimization, as adding and checking for existence
    // in a Set has an average time complexity of O(1).
    const directories = new Set()

    // The root directory "/" is always a possibility, so add it upfront.
    directories.add("/")

    // Iterate over each page object in the array in a single pass.
    pagesArray.forEach((page) => {
        // 1. Remove the trailing "/Page" from the label
        const cleanedLabel = page.label.replace(/\Page$/, "")

        // 2. If the cleaned label is not empty, process its path segments.
        if (cleanedLabel) {
            // Split the label into its individual path segments.
            const segments = cleanedLabel.split("/")
            let currentPath = ""

            // Build up the directory paths piece by piece.
            // For a path like "legal/privacy-policy", this will generate "legal/" and "legal/privacy-policy".
            for (let i = 0; i < segments.length; i++) {
                // Append the current segment.
                currentPath += segments[i]

                // If it's not the last segment, it's a parent directory.
                // We add both the full path segment and the one with a trailing slash.
                if (i < segments.length - 1) {
                    directories.add(currentPath + "/")
                    currentPath += "/" // Add slash to the path for the next iteration.
                } else {
                    // If it's the last segment, it's a full path, so add it as is.
                    directories.add(currentPath)
                }
            }
        }
    })

    // Convert the Set back to an array and sort it for a consistent, readable output.
    // The sort operation is the final step and has a time complexity of O(K log K),
    // where K is the number of unique directories, which is unavoidable if sorting is required.
    return [...directories].sort()
}
export async function getPages(cms, col, column = "slug") {
    const contents = cms.initContent()
    const collection = contents.collections[col]
    const documents = await Array.fromAsync(collection)

    return getPossibleDirectories(documents)
}
