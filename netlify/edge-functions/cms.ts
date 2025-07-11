import type { Config, Context } from "https://esm.sh/@netlify/edge-functions"
import { Octokit } from "https://esm.sh/@octokit/rest"
import lumeCMS from "https://cdn.jsdelivr.net/gh/kylesloper/lume-cms@1d03ed3a8c49e33879a0033b1275111a7c0212f4/mod.ts"
import GitHub from "https://cdn.jsdelivr.net/gh/kylesloper/lume-cms@1d03ed3a8c49e33879a0033b1275111a7c0212f4/storage/github.ts"
import _config from "../../config/index.ts"

export default async function handler(req: Request, ctx?: Context) {
    // Initialize these outside the handler to reuse across requests
    const cms = lumeCMS({
        site: {
            name: _config.name,
            url: _config.url,
            body: _config.body,
        },
        root: "", // Required so that Deno.cwd() isn't run.. thanks Oscar!
        extraHead: `
                   <link rel="preload" href="https://cdn.jsdelivr.net/gh/kylesloper/lume-cms@1d03ed3a8c49e33879a0033b1275111a7c0212f4/static/styles.css" as="style" onload="this.rel='stylesheet'">

                   <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
                   <link rel="prefetch" href="https://cdn.jsdelivr.net/gh/kylesloper/lume-cms@1d03ed3a8c49e33879a0033b1275111a7c0212f4/static/styles.css" as="style">

                   <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kylesloper/lume-cms@1d03ed3a8c49e33879a0033b1275111a7c0212f4/static/styles.css"></noscript>
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
                        return `[cms] ${currentUser}updated ${path}`
                    case "delete":
                        return `[cms] ${currentUser}deleted ${path}`
                    default:
                        return `[cms] ${currentUser} modified ${path}`
                }
            },
        })
    )

    _config.cnfg(cms)

    // cms.field("library", {
    //     tag: "library-field",
    //     jsImport:
    //         "https://cdn.jsdelivr.net/gh/kylesloper/lume-cms-widgets/library/index.js",
    //     applyChanges(data, changes, field) {
    //         const { name } = field
    //         const value = changes[name]
    //         data[name] = value
    //     },
    // })

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
