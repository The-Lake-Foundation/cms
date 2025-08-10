// import * as blocks from "../../../../../../lume-cms-partials/blocks/index.js"
import * as blocks from "https://esm.sh/gh/moonfacedigital/lume-cms-partials@45ebff739efb93cd0f4828ae1ce09a60aa5c7593/blocks/index.js"
import { getStore } from "@netlify/blobs"
import { type Context } from "https://edge.netlify.com/"

const CACHE_KEY = "processed-blocks"
const CACHE_TTL = 3600 // 1 hour

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

export async function getBlocks(context?: Context): Promise<Block[]> {
    // Try to get from Netlify Blobs store first
    if (context) {
        try {
            const store = getStore("cms-cache")
            const cached = await store.get(CACHE_KEY, { type: "json" })
            if (cached) {
                console.log("returning blocks from Netlify Blobs")
                return cached as Block[]
            }
        } catch (error) {
            console.log(
                "Cache read failed, proceeding with fresh processing",
                error
            )
        }
    }

    console.log("processing blocks for the first time")

    // Convert blocks object to array of block objects
    const blocksArray = Object.values(blocks) as Block[]

    // Add template to the beginning of each block's fields array (spread is faster than unshift)
    const processedBlocks = blocksArray.map((block) => ({
        ...block,
        fields: [template, ...block.fields],
    }))

    // Cache in Netlify Blobs store
    if (context) {
        try {
            const store = getStore("cms-cache")
            await store.setJSON(CACHE_KEY, processedBlocks, {
                metadata: {
                    createdAt: Date.now(),
                    ttl: CACHE_TTL,
                },
            })
            console.log("cached blocks in Netlify Blobs")
        } catch (error) {
            console.log("Cache write failed", error)
        }
    }

    return processedBlocks
}
