import { getRemotePackageMetadata } from "./getRemotePackageMetadata";


export async function getRemotePackageVersion(packageName: string) {
    const metadata = await getRemotePackageMetadata(packageName);
    return metadata?.version || null;
}