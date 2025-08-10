// import * as blocks from "../../../../../../lume-cms-partials/blocks/index.js"
import * as blocks from "https://esm.sh/gh/moonfacedigital/lume-cms-partials@45ebff739efb93cd0f4828ae1ce09a60aa5c7593/blocks/index.js"

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

export async function getBlocks(): Promise<Block[]> {
    const blocksArray = Object.values(blocks) as Block[]

    const processedBlocks = blocksArray.map((block) => ({
        ...block,
        fields: [template, ...block.fields],
    }))

    return processedBlocks
}
