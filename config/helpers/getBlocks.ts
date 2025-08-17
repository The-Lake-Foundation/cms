// import * as blocks from "../../../../../../lume-cms-partials/blocks/index.js"
import * as blocks from "https://esm.sh/gh/moonfacedigital/lume-cms-partials@2a774972eade5d3b447f687d042ac8e61b8cd56b/blocks/index.js"

const template = {
    name: "blockAppearance",
    label: "Block Appearance",
    type: "object",
    fields: [
        {
            name: "blockWidth",
            label: "Block Width",
            description: "Percentage of the section the block should take up",
            type: "select",
            options: ["auto", "100%", "75%", "50%", "25%"],
            value: "auto",
        },
        {
            name: "selfAlignment",
            label: "Self Alignment",
            type: "object",
            fields: [
                {
                    name: "xAlignment",
                    label: "X Alignment",
                    type: "select",
                    options: ["start", "end", "center"],
                },
                {
                    name: "yAlignment",
                    label: "Y Alignment",
                    type: "select",
                    options: ["start", "end", "center"],
                },
            ],
        },
        {
            name: "advanced",
            type: "object",
            fields: [
                {
                    name: "textAlignment",
                    label: "Text Alignment",
                    type: "select",
                    options: ["left", "center", "right"],
                    value: "left",
                },
                {
                    name: "css",
                    label: "Custom CSS",
                    type: "code",
                    value: "{}",
                    attributes: {
                        data: {
                            language: "CSS",
                        },
                    },
                },
            ],
        },
    ],
}

// Define the Field type
type Field = {
    name: string
    label: string
    type: string
    [key: string]: unknown
}

// Define the Block type based on the structure
type Block = {
    name: string
    label: string
    fields: Field[]
    [key: string]: unknown
}

interface Exclude {
    blocks?: string[]
    categories?: string[]
}
interface Include {
    blocks?: string[]
    categories?: string[]
}

export async function getBlocks({
    exclude,
    include,
}: {
    exclude?: Exclude
    include?: Include
} = {}): Promise<Block[]> {
    let blocksArray = Object.values(blocks) as Block[]

    // First apply include filters if they exist
    if (include) {
        // Include by specific block names
        if (include.blocks) {
            blocksArray = blocksArray.filter((block) =>
                include.blocks.includes(block.name)
            )
        }

        // Include by categories
        if (include.categories) {
            blocksArray = blocksArray.filter((block) => {
                if (!block.category) return false // Exclude blocks with no category if we're filtering by category

                const blockCategories = Array.isArray(block.category)
                    ? block.category
                    : [block.category]

                return blockCategories.some((cat) =>
                    include.categories.includes(cat)
                )
            })
        }
    }

    // Then apply exclude filters if they exist
    if (exclude) {
        // Exclude by specific block names
        if (exclude.blocks) {
            blocksArray = blocksArray.filter(
                (block) => !exclude.blocks.includes(block.name)
            )
        }

        // Exclude by categories
        if (exclude.categories) {
            blocksArray = blocksArray.filter((block) => {
                if (!block.category) return true // Keep blocks with no category

                const blockCategories = Array.isArray(block.category)
                    ? block.category
                    : [block.category]

                return !blockCategories.some((cat) =>
                    exclude.categories.includes(cat)
                )
            })
        }
    }

    // Add the appearance template to each block
    const processedBlocks = blocksArray.map((block) => ({
        ...block,
        fields: [template, ...block.fields],
    }))

    return processedBlocks
}
