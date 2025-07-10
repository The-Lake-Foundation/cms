import { serve } from "https://deno.land/std@0.192.0/http/server.ts"
import yourEdgeFunction from "./netlify/edge-functions/cms.ts"
import { Context } from "https://esm.sh/@netlify/types@2.0.2/dist/main.d.ts"

serve(
    async (req: Request) => {
        // Add any routing logic here if needed
        return await yourEdgeFunction(req, {} as Context)
    },
    { port: 8888 }
)
