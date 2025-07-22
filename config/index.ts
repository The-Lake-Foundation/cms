export default {
    name: "The 1% Club CMS",
    url: "https://staging.b.theonepercentclub.uk",
    body: `
    <p>Long text, for instructions or other content that you want to make it visible in the homepage</p>
    `,

    cnfg: (cms, props) => {
        cms.upload({
            name: "uploads",
            store: "gh:src/content/uploads",
        })
        cms.collection({
            name: "pages",
            store: "gh:src/content/pages/**/index.json",
            documentName: (data) => {
                return `${data["page-data"].slug}/index.json`
            },
            documentLabel: (name) => {
                return name.replace("index.json", "Page")
            },
            rename: "auto",
            labelSingular: "page",
            fields: [
                {
                    name: "status",
                    type: "select",
                    options: ["Draft", "Approved", "Published"],
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
                            type: "text",
                            attributes: {
                                required: true,
                            },
                            description:
                                "The URL slug for this page, e.g. 'about-us', 'legal/privacy-policy'",
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
                                            language: "css",
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
