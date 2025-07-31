function formatLabels(arr) {
    return arr.map((item) => {
        let formattedLabel = item.label.replace(/\/Page$/, "")
        if (formattedLabel === "/Page") {
            return "/"
        }
        return formattedLabel
    })
}
export async function getDocuments(cms, col, column = "slug") {
    const contents = cms.initContent()
    const collection = contents.collections[col]
    const documents = await Array.fromAsync(collection)

    return formatLabels(documents)
}
