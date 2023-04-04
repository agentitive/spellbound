import { green, red, yellow } from "colors";
import { table } from "table";
import { getRemotePackageDependencies } from "./utils";
import { allLibraries } from "./utils";

type PackageInfo = {
    name: string;
    published: boolean;
    problems: string[];
}

async function checkPackage(packageName: string) {
    const dependencies = await getRemotePackageDependencies(packageName);

    if (!dependencies) {
        return {
            name: packageName,
            published: false,
            problems: []
        }
    }

    const problems = Object.entries(dependencies)
        .filter(([depName]) => depName.startsWith("workspace:"))
        .map(([depName]) => depName)

    return {
        name: packageName,
        published: true,
        problems
    }
}

function sortPackages(packages: PackageInfo[]) {
    return packages.sort((a, b) => {
        if (a.published && !b.published) {
            return -1;
        }
        if (!a.published && b.published) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });
}

function formatPackage(packageInfo: PackageInfo) {
    const { name, published, problems } = packageInfo;
    const title = problems.length ? red(name) : published ? green(name) : yellow(name);
    return [title, published ? problems.join(", ") : "Not published."]
}

async function main() {
    const projects = allLibraries()
    const infos = await Promise.all(projects.map(p => checkPackage(p.packageName)));
    const sorted = sortPackages(infos);
    const rows = sorted.map(formatPackage);
    console.log("Workspace dependency problems:")
    console.log(table([
        ["Package", "Problems"],
        ...rows
    ]));
}

main();