export default {
    name: "The 1% Club CMS",
    url: "https://staging.b.theonepercentclub.uk",
    body: `
    <p>Long text, for instructions or other content that you want to make it visible in the homepage</p>
    `,

    cnfg: (cms) => {
        cms.upload({
            name: "uploads",
            store: "gh:src/content/uploads",
        })
        cms.collection({
            name: "posts",
            store: "gh:src/content/posts/*.json",
            fields: [
                {
                    name: "status",
                    type: "select",
                    options: ["Draft", "Approved", "Published"],
                    value: "Draft",
                },
                {
                    name: "meta",
                    label: "Metadata",
                    type: "object",
                    fields: [
                        "title: text!",
                        "description: text!",
                        {
                            name: "image",
                            type: "file",
                            upload: "uploads",
                        },
                    ],
                },
                "content: markdown",
                {
                    name: "image",
                    type: "file",
                    upload: "uploads",
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
                            fields: [
                                "body: markdown",
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
                },
            ],
            documentLabel(name) {
                return name.replace(".json", "")
            },
            documentName(data) {
                return `${data.title}-${data.author}.md`
            },
        })
    },
}
