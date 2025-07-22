// deps.config.ts
export default {
    jsr: [
        "@std/html@1.0.4",
        "@std/html@1.0.3", //  Have zero idea why this is needed, but it is
        "@std/yaml@1.0.9",
        "@std/front-matter@1.0.9",
        "@std/fs@1.0.19",
        "@std/path@1.1.1",
        "@std/path@1.0.8", //  Have zero idea why this is needed, but it is
        "@std/fmt@1.0.8",
        "@std/encoding@1.0.10",
        "@std/media-types@1.1.0",
        "@std/log@0.224.14",
        "@hono/hono@4.8.5",
        "@davidbonnet/astring@1.8.6",
    ],
    npm: [
        "octokit@5.0.3",
        "meriyah@6.0.5",
        "estree-walker@3.0.3",
        "@imagemagick/magick-wasm@0.0.35",
    ],
    cdn: [],
    subpathExports: {
        jsr: {
            "@std/html": ["entities"],
            "@std/yaml": [],
            "@std/front-matter": ["yaml"],
            "@std/fs": [],
            "@std/path": ["posix"],
            "@std/fmt": ["bytes"],
            "@std/encoding": ["base64"],
            "@std/media-types": ["content-type"],
            "@std/log": [],
            "@hono/hono": ["http-exception", "basic-auth", "deno"],
        },
        npm: {},
    },
}
