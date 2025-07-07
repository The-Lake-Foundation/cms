// deps.config.ts
export default {
    jsr: [
        "@std/html@1.0.3",
        "@std/yaml@1.0.6",
        "@std/front-matter@1.0.9",
        "@std/fs@1.0.17",
        "@std/path@1.0.9",
        "@std/path@1.0.8",
        "@std/fmt@1.0.7",
        "@std/encoding@1.0.10",
        "@std/media-types@1.1.0",
        "@std/log@0.224.14",
        "@hono/hono@4.7.8",
        "@davidbonnet/astring@1.8.6",
    ],
    npm: [
        "octokit@4.1.3",
        "meriyah@6.0.5",
        "estree-walker@3.0.3",
        "@imagemagick/magick-wasm@0.0.34",
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
