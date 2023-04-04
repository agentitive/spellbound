import { RushConfigurationProject } from "@microsoft/rush-lib"
import { readFileSync, writeFileSync } from "fs"
import { allApps, allLibraries } from "./utils"
import type { PackageJson } from 'types-package-json';
import { execSync } from "child_process"


const depTypes: ((keyof PackageJson) & ('dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'))[] = [
    "dependencies", 
    "devDependencies", 
    "peerDependencies", 
    "optionalDependencies"
]

function readPackageJson(lib: RushConfigurationProject) {
    const file = readFileSync(`${lib.publishFolder}/package.json`, "utf8")
    const packageJson = JSON.parse(file) as PackageJson
    return packageJson
}

function bumpDeps(libs: string[], versionNumber: string, packageJson: PackageJson, depType: keyof PackageJson & ('dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies')) {
    if (!packageJson[depType]) {
        return
    }
    const deps = packageJson[depType]
    const libDeps = Object.keys(deps!).filter((dep) => libs.includes(dep))
    // Bump versions of the deps
    libDeps.forEach((dep) => {
        deps![dep] = `workspace:^${versionNumber}`
    })
}

function commitChanges(msg: string) {
    return `git add --all && git commit -m "${msg}"`
}

function bumpLibVersion(libPath: string, versionNumber: string) {
    return `cd libs/${libPath} && pnpm version ${versionNumber}`
}

function getAllLibsAndApps(libs: RushConfigurationProject[], apps: RushConfigurationProject[]) {
    return [...libs, ...apps]
}

function getPackageNames(libs: RushConfigurationProject[]) {
    return libs.map((lib) => readPackageJson(lib).name)
}

function getAllPackageNames(libs: RushConfigurationProject[], apps: RushConfigurationProject[]) {
    const allLibNames = getPackageNames(libs)
    const allAppNames = getPackageNames(apps)

    return [...allLibNames, ...allAppNames]
}

function run() {
    const versionNumber = process.argv[3]
    const libs = allLibraries()
    const apps = allApps()

    const libsAndApps = getAllLibsAndApps(libs, apps)
    const allPackageNames = getAllPackageNames(libs, apps)

    // Bump all solid deps to the new version in each solid lib
    for (const lib of libsAndApps) {

        const packageJson = readPackageJson(lib)

        depTypes.forEach((depType) => bumpDeps(allPackageNames, versionNumber, packageJson, depType))
        writeFileSync(`${lib.publishFolder}/package.json`, JSON.stringify(packageJson, null, 4))
    }

    execSync(
        commitChanges(`Bump all solid deps to ${versionNumber}`), 
        { 
            stdio: "inherit" 
        }
    )
    // Bump lib versions
    for (const lib of libs) {
        execSync(
            `${bumpLibVersion(lib.unscopedTempProjectName, versionNumber)} && 
            cd ../../`,
            { 
                stdio: "inherit" 
            }
        )
    }

    execSync(
        commitChanges(`Bump all libs to ${versionNumber}`), 
        { 
            stdio: "inherit" 
        }
    )
}

run()