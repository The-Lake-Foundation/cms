import yourEdgeFunction from "./netlify/edge-functions/cms.ts"
console.log("SCRIPT STARTED")
process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:", error)
    process.exit(1)
})
process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error)
    process.exit(1)
})
Deno.serve(
    {
        port: 8888,
    },
    async (req: Request) => {
        // Add any routing logic here if needed
        return await yourEdgeFunction(req, undefined)
    }
)
