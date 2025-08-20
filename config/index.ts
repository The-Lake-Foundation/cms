import { getPages } from "./helpers/getPages.ts"
import { getBlocks } from "./helpers/getBlocks.ts"
import { normalizeSlug } from "./helpers/normalizeSlug.ts"

export default {
    name: "The 1% Club CMS",
    url: "https://staging.b.theonepercentclub.uk",
    body: `
    <p>Long text, for instructions or other content that you want to make it visible in the homepage</p>
    `,

    cnfg: async (cms, props) => {
        globalThis.getPages = getPages
        globalThis.cms = cms
        cms.upload({
            name: "uploads",
            store: "gh:src/content/uploads/**/*",
        })
        cms.upload({
            name: "system uploads",
            store: "gh:src/content/systemUploads/**/*",
        })
        cms.collection({
            name: "pages",
            store: "gh:src/content/pages/**/index.json",
            documentName: (data) => {
                let slug = data.pageData.slug

                // Standardize slug format - ensure starts with / and no trailing /
                slug = normalizeSlug(slug)

                // Handle root page specially
                if (slug === "/") return "index.json"

                // Remove leading slash for path construction
                return `${slug.slice(1)}/index.json`
            },
            documentLabel: (name) => {
                return name === "index.json"
                    ? "Page"
                    : name.replace("index.json", "Page")
            },
            rename: "auto",
            autoAddPrefix: false,
            labelSingular: "page",
            duplicationModifiers: [
                {
                    field: "name",
                    expression:
                        "name.replace('/index.json', '-copy/index.json')",
                },
                {
                    field: "status",
                    value: "draft",
                },
                {
                    field: "pageData.slug",
                    expression: "data.pageData.slug + '-copy'",
                },
            ],
            fields: [
                {
                    name: "status",
                    type: "select",
                    value: "draft",
                    duplicationValue: "draft",
                    options: [
                        {
                            label: "Draft",
                            value: "draft",
                        },
                        {
                            label: "Review",
                            value: "review",
                        },
                        {
                            label: "Published",
                            value: "published",
                        },
                    ],
                },
                {
                    name: "pageData",
                    type: "object",
                    attributes: {
                        open: true,
                    },
                    fields: [
                        {
                            name: "slug",
                            type: "combobox",
                            description:
                                "The URL slug for this page, e.g. '/about-us', '/legal/privacy-policy'",
                            attributes: {
                                required: true,
                            },
                            value: "/" + props?.folder,
                            async init(field, { data }, doc) {
                                field.options = await globalThis.getPages(
                                    cms,
                                    "pages"
                                )
                            },
                            transform(value) {
                                return normalizeSlug(value)
                            },
                        },
                        "title: text!",
                        "description: text!",
                        {
                            name: "image",
                            type: "file",
                            upload: "uploads",
                        },
                    ],
                },
                {
                    name: "sections",
                    type: "object-list",
                    fields: [
                        {
                            name: "name",
                            type: "text",
                            description:
                                "Semantic name to help you identify the section",
                            label: "Section Name",
                        },
                        {
                            name: "appearance",
                            type: "object",
                            fields: [
                                {
                                    name: "width",
                                    type: "select",
                                    options: [
                                        "full",
                                        "content",
                                        "feature",
                                        "narrow",
                                    ],
                                    value: "content",
                                },
                                {
                                    name: "alignment",
                                    type: "select",
                                    options: ["start", "center", "end"],
                                    value: "center",
                                },
                                {
                                    name: "childAlignment",
                                    type: "object",
                                    fields: [
                                        {
                                            name: "xAlignment",
                                            label: "X Alignment",
                                            type: "select",
                                            options: [
                                                "start",
                                                "end",
                                                "between",
                                                "around",
                                                "center",
                                            ],
                                            value: "start",
                                        },
                                        {
                                            name: "yAlignment",
                                            label: "Y Alignment",
                                            type: "select",
                                            options: [
                                                "start",
                                                "end",
                                                "between",
                                                "around",
                                                "center",
                                            ],
                                            value: "start",
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
                        },
                        {
                            name: "blocks",
                            label: "Blocks",
                            type: "library", // Custom type for this field
                            fields: [
                                ...(await getBlocks()),
                                {
                                    name: "hero", // Value for the 'type' property in saved data
                                    label: "Hero", // Label displayed in the modal
                                    type: "object", // <-- CRUCIAL: This type ensures it saves as an object
                                    // Custom property for modal UI presentation
                                    category: ["Components"],
                                    description:
                                        "A large, engaging section at the top of the page",
                                    // diagram: "/img/hero-diagram.png",
                                    fields: [
                                        {
                                            name: "text",
                                            label: "Headline",
                                            type: "text",
                                        },
                                        {
                                            name: "subheading",
                                            label: "Subheading",
                                            type: "textarea",
                                            required: false,
                                        },
                                        {
                                            name: "blocks",
                                            label: "Blocks",
                                            type: "library",
                                            fields: [...(await getBlocks())],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
        cms.collection({
            name: "forms",
            store: "gh:src/content/forms/**.json",
            labelSingular: "form",
            fields: [],
        })
    },
}
