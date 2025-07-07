import type { Config, Context } from "https://esm.sh/@netlify/edge-functions"
import { Octokit } from "https://esm.sh/octokit"

export default async function handler(req: Request, context: Context) {
    /* Deno polyfills for Edge Functions */

    const cacheStore = new Map<string, Response>()

    globalThis.caches = {
        open: async (cacheName: string) => ({
            match: async (request: RequestInfo | URL) => {
                const key = typeof request === "string" ? request : request.url
                return cacheStore.get(key)
            },
            put: async (request: RequestInfo | URL, response: Response) => {
                const key = typeof request === "string" ? request : request.url
                cacheStore.set(key, response)
            },
            delete: async (request: RequestInfo | URL) => {
                const key = typeof request === "string" ? request : request.url
                return cacheStore.delete(key)
            },
            keys: async () =>
                Array.from(cacheStore.keys()).map((url) => new Request(url)),
        }),
    } as unknown as CacheStorage

    /* End of Deno polyfills for Edge Functions */

    const lumeCMS = (
        await import(
            "https://cdn.jsdelivr.net/gh/lumeland/cms@6771d43a29cb63431078615b4e31a69af8aee46e/mod.ts"
        )
    ).default
    const GitHub = (
        await import(
            "https://cdn.jsdelivr.net/gh/lumeland/cms@6771d43a29cb63431078615b4e31a69af8aee46e/storage/github.ts"
        )
    ).default

    // Initialize these outside the handler to reuse across requests
    const cms = lumeCMS({
        site: {
            name: "The 1% Club CMS",
            url: "https://staging.b.theonepercentclub.uk",
        },
        root: "", // Required so that Deno.cwd() isn't run.. thanks Oscar!
    })

    const client = new Octokit({
        auth: Deno.env.get("GITHUB_TOKEN"),
    })

    cms.auth({
        [Deno.env.get("CMS_USER")]: Deno.env.get("CMS_PASSWORD"),
    })

    cms.storage(
        "gh",
        new GitHub({
            client: client,
            owner: "the-lake-foundation",
            repo: "lume-cms",
        })
    )

    cms.collection({
        name: "posts",
        store: "gh:src/posts/*.json",
        fields: ["title: text!", "author: text!", "content: markdown"],
        documentLabel(name) {
            return name.replace(".json", "")
        },
    })

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
