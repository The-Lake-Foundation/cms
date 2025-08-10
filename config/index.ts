import { getPages } from "./helpers/getPages.ts"
import { getBlocks } from "./helpers/getBlocks.ts"

export default {
    name: "The 1% Club CMS",
    url: "https://staging.b.theonepercentclub.uk",
    body: `
    <p>Long text, for instructions or other content that you want to make it visible in the homepage</p>
    `,

    cnfg: async (cms, props) => {
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

                // Use a regular expression to remove one or more leading slashes.
                // The '^' anchors the pattern to the beginning of the string, and '\/+'
                // matches one or more forward slashes.
                slug = slug.replace(/^\/+/, "")

                // Use a regular expression to remove one or more trailing slashes.
                // The '$' anchors the pattern to the end of the string, and '\/+'
                // matches one or more forward slashes.
                slug = slug.replace(/\/+$/, "")

                return `${slug}/index.json`
            },
            documentLabel: (name) => {
                return name.replace("index.json", "Page")
            },
            rename: "auto",
            autoAddPrefix: false,
            labelSingular: "page",
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
                                "The URL slug for this page, e.g. 'about-us', 'legal/privacy-policy'",
                            attributes: {
                                required: true,
                            },
                            value: props?.folder,
                            async init(field, { data }, doc) {
                                field.options = await getPages(cms, "pages")
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
                                    category: ["Content"],
                                    description:
                                        "A large, engaging section for key messages.",
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
                                            name: "image",
                                            label: "Background Image",
                                            type: "file",
                                            required: false,
                                        },
                                        {
                                            name: "cta_text",
                                            label: "Call to Action Text",
                                            type: "text",
                                            required: false,
                                        },
                                        {
                                            name: "cta_link",
                                            label: "Call to Action Link",
                                            type: "url",
                                            required: false,
                                        },
                                    ],
                                },
                                {
                                    name: "textBlock",
                                    label: "Text Block",
                                    type: "object",
                                    category: ["Primitive"],
                                    description:
                                        "A simple paragraph of rich text content.",
                                    fields: [
                                        {
                                            name: "appearance",
                                            type: "object",
                                            fields: [
                                                {
                                                    name: "width",
                                                    type: "select",
                                                    options: [
                                                        "auto",
                                                        "100%",
                                                        "75%",
                                                        "50%",
                                                        "25%",
                                                    ],
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
                                                            options: [
                                                                "start",
                                                                "end",
                                                                "center",
                                                            ],
                                                        },
                                                        {
                                                            name: "yAlignment",
                                                            label: "Y Alignment",
                                                            type: "select",
                                                            options: [
                                                                "start",
                                                                "end",
                                                                "center",
                                                            ],
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
                                                                    language:
                                                                        "CSS",
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            name: "text",
                                            type: "text",
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
            store: "gh:src/content/forms/**/index.json",
            documentName: (data) => {
                let slug = data.pageData.slug

                // Use a regular expression to remove one or more leading slashes.
                // The '^' anchors the pattern to the beginning of the string, and '\/+'
                // matches one or more forward slashes.
                slug = slug.replace(/^\/+/, "")

                // Use a regular expression to remove one or more trailing slashes.
                // The '$' anchors the pattern to the end of the string, and '\/+'
                // matches one or more forward slashes.
                slug = slug.replace(/\/+$/, "")

                return `${slug}/index.json`
            },
            documentLabel: (name) => {
                return name.replace("index.json", "Page")
            },
            rename: "auto",
            autoAddPrefix: false,
            labelSingular: "page",
            fields: [],
        })
    },
}
