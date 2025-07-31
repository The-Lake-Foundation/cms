import { getPages } from "./helpers/getPages.ts"

export default {
    name: "The 1% Club CMS",
    url: "https://staging.b.theonepercentclub.uk",
    body: `
    <p>Long text, for instructions or other content that you want to make it visible in the homepage</p>
    `,

    cnfg: async (cms, props) => {
        cms.upload({
            name: "uploads",
            store: "gh:src/content/uploads",
        })
        cms.collection({
            name: "pages",
            store: "gh:src/content/pages/**/index.json",
            documentName: (data) => {
                let slug = data["page-data"].slug

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
                    value: "Draft",
                },
                {
                    name: "page-data",
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
                                    name: "child-alignment",
                                    type: "object",
                                    fields: [
                                        {
                                            name: "x-alignment",
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
                                            name: "y-alignment",
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
                            type: "choose-list",
                            fields: [
                                {
                                    name: "title",
                                    type: "object",
                                    fields: ["text: text"],
                                },
                                {
                                    name: "content",
                                    type: "object",
                                    fields: ["body: markdown"],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
    },
}
