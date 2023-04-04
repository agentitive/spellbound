export type PackageMetadata = {
    _id: string
    _rev: string
    name: string
    description: string
    "dist-tags": {
        latest: string
    } & Record<string, string>
    version: string
    versions: Record<string, string>
    dependencies: Record<string, string>
    peerDependencies: Record<string, string>
    devDependencies: Record<string, string>
    scripts: Record<string, string>
}