import { RushConfiguration, RushConfigurationProject as RCP } from "@microsoft/rush-lib"
import { green, yellow } from "colors";
import { table } from "table";
import { allLibraries, getRemotePackageVersion } from "./utils";

type PackageInfo = {
    name: string;
    localVersion: string;
    publishedVersion: string;
}

async function getPackageVersions(project: RCP): Promise<PackageInfo> {
    const localVersion = project.packageJson.version;
    const remoteVersion = await getRemotePackageVersion(project.packageName);
    const publishedVersion = remoteVersion || "Not published";
    return {
        name: project.packageName,
        localVersion,
        publishedVersion
    };
}

function toArray(info: PackageInfo) {
    const { name, localVersion, publishedVersion } = info;
    const title = localVersion === publishedVersion ? green(name) : yellow(name);
    return [title, localVersion, publishedVersion];
}

function toTable(packages: PackageInfo[]) {
    const rows = packages.map(toArray);
    return table([
        ["Package", "Local", "Published"],
        ...rows
    ])
}

async function main() {
    const libs = allLibraries();
    const packages = await Promise.all(libs.map(getPackageVersions));
    console.log(toTable(packages));
}

main();