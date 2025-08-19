import type { Config, Context } from "https://esm.sh/@netlify/edge-functions"
import { Octokit } from "https://esm.sh/@octokit/rest"
// import lumeCMS from "../../../../../../lume-cms/mod.ts"
// import GitHub from "../../../../../../lume-cms/storage/github.ts"
import lumeCMS from "https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/mod.ts"
import GitHub from "https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/storage/github.ts"
import { transform } from "https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/fields/utils.ts"
import type {
    Data,
    FieldDefinition,
    GroupField,
    ResolvedGroupField,
} from "https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/types.ts"

import _config from "../../config/index.ts"

export default async function handler(req: Request, ctx?: Context) {
    const USE_LOCAL_FIELDS = false

    const REMOTE_FIELDS_URL =
        "https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms-fields@610b9f60b9dd37bbfe24286e73857d660be92fa4/"

    const FIELDS_URL = globalThis?.Netlify // Checks for Netlify in the global scope
        ? REMOTE_FIELDS_URL // Use CDN if Netlify is detected
        : Boolean(USE_LOCAL_FIELDS) === true // If not Netlify, check if local fields are explicitly requested
        ? "http://localhost:4545/"
        : REMOTE_FIELDS_URL // Otherwise, default to the CDN

    console.log("Using fields URL:", FIELDS_URL)

    const url = new URL(req.url)
    const props = {
        folder: url.searchParams.get("folder") ?? "",
    }

    const cms = lumeCMS({
        site: {
            name: _config.name,
            url: _config.url,
            body: _config.body,
        },
        root: "", // Required so that Deno.cwd() isn't run.. thanks Oscar!
        extraHead: `
                   <link rel="preload" href="https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/static/styles.css" as="style" onload="this.rel='stylesheet'">

                   <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
                   <link rel="prefetch" href="https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/static/styles.css" as="style">

                   <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/moonfacedigital/lume-cms@af45d4f2f51238bad6f5e68263952d0a458b8c73/static/styles.css"></noscript>
                    <meta
			name="viewport"
			content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
		/>
       
                   `,
    })

    const client = new Octokit({
        auth: Deno.env.get("GITHUB_TOKEN"),
    })

    const currentUser = Deno.env.get("CMS_USER")
    const cmsPassword = Deno.env.get("CMS_PASSWORD")

    cms.auth({
        [currentUser]: cmsPassword,
    })

    cms.storage(
        "gh",
        new GitHub({
            // @ts-ignore Octokit type definitions are not compatible with the one used by lumeCMS
            client: client,
            owner: "The-Lake-Foundation",
            repo: "onepercentapp",
            branch: "staging",
            commitMessage: ({ action, path }) => {
                switch (action) {
                    case "create":
                        return `[cms] ${currentUser} created ${path}`
                    case "update":
                        return `[cms] ${currentUser} updated ${path}`
                    case "delete":
                        return `[cms] ${currentUser} deleted ${path}`
                    default:
                        return `[cms] ${currentUser} modified ${path}`
                }
            },
        })
    )

    cms.field("combobox", {
        tag: "f-combobox",
        jsImport: FIELDS_URL + "combobox/index.js",
        applyChanges(data, changes, field) {
            const { name } = field
            const value = changes[name]
            data[name] = value || undefined
        },
    })

    cms.field("library", {
        tag: "f-library",
        jsImport: FIELDS_URL + "library/index.js",
        async applyChanges(data, changes, field, document, cmsContent) {
            const value = await Promise.all(
                Object.values(changes[field.name] || {}).map(
                    async (subchanges) => {
                        const type = subchanges.type as string
                        const value = { type } as Data
                        const chooseField = field.fields?.find(
                            (f) => f.name === type
                        ) as ResolvedGroupField | undefined

                        if (!chooseField) {
                            throw new Error(`No field found for type '${type}'`)
                        }

                        for (const f of chooseField?.fields || []) {
                            await f.applyChanges(
                                value,
                                subchanges,
                                f,
                                document,
                                cmsContent
                            )
                        }

                        return value
                    }
                )
            )
            data[field.name] = transform(field, value)
        },
    })

    await _config.cnfg(cms, props)

    // Initialize app only once
    let app: ReturnType<typeof cms.init> | null = null
    try {
        app = cms.init()
        console.log("Lume CMS initialized")

        return await app.fetch(req)
    } catch (error) {
        console.error("Error in handler:", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}

export const config: Config = {
    path: "/*",
}
