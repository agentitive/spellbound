import { getRemotePackageMetadata } from "./getRemotePackageMetadata";


export async function getRemotePackageDependencies(packageName: string) {
    const metadata = await getRemotePackageMetadata(packageName);
    return metadata?.dependencies || null;
}