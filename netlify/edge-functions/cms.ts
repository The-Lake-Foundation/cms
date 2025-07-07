import type { Config, Context } from "https://esm.sh/@netlify/edge-functions"
import { Octokit } from "https://esm.sh/octokit"

export default async function handler(req: Request, context: Context) {
    // More complete polyfill with in-memory cache
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
    ;(Deno as any).cwd = () => ""

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
            name: "My Awesome Site",
            url: "https://localhost:8000",
        },
    })

    const client = new Octokit({
        auth: "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",
    })

    cms.auth({
        admin: "admin",
    })

    cms.storage(
        "gh",
        new GitHub({
            client,
            owner: "moonfacedigital",
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
