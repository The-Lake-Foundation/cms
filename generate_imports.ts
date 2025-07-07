// tools/generate-import-map.ts
import deps from "./deps.config.ts"

function generateMappings() {
    const imports: Record<string, string> = {}

    // Handle JSR packages
    for (const pkg of deps.jsr) {
        // Base mapping
        imports[`jsr:${pkg}`] = `https://esm.sh/jsr/${pkg}`

        const pkgNoVersion = pkg.startsWith("@")
            ? "@" + pkg.slice(1).split("@")[0]
            : pkg.split("@")[0]

        console.log(`Processing JSR package: ${pkgNoVersion}`)

        if (deps.subpathExports?.jsr?.[pkgNoVersion]) {
            for (const subpath of deps.subpathExports.jsr[pkgNoVersion]) {
                const subpathKey = `jsr:${pkg}/${subpath}`
                const subpathValue = `https://esm.sh/jsr/${pkg}/${subpath}`
                imports[subpathKey] = subpathValue
            }
        }
    }

    // Handle npm packages
    for (const pkg of deps.npm) {
        const [name, version] = pkg.split("@")
        const fullName = version ? `${name}@${version}` : name

        imports[`npm:${fullName}`] = `https://esm.sh/${fullName}`
        imports[name] = `https://esm.sh/${fullName}`

        // Handle subpath exports if defined (for npm packages)
        if (deps.subpathExports?.npm?.[name]) {
            for (const subpath of deps.subpathExports.npm[name]) {
                const subpathKey = `${name}/${subpath}`
                const subpathValue = `https://esm.sh/${fullName}/${subpath}`
                imports[subpathKey] = subpathValue
                imports[`npm:${subpathKey}`] = subpathValue
            }
        }
    }

    // Handle CDN dependencies
    for (const url of deps.cdn) {
        const name = url
        imports[name] = url
    }

    return { imports }
}

const importMap = generateMappings()

Deno.writeTextFileSync("./import_map.json", JSON.stringify(importMap, null, 2))

console.log("Successfully generated import_map.json")
