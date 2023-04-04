import { allLibraries } from "./utils"
import { execSync } from "child_process"


function getPackagePath(packageName: string) {
    const library = allLibraries().find((lib) => lib.packageName === packageName)

    if (!library) {
        throw new Error(`Could not find library named: ${packageName}`)
    }

    return library.publishFolder

}

function saveBackupTsconfig(libraryPath: string) {
    return `cp ${libraryPath}/tsconfig.json ~/tmpfile`
}

function useTsconfigTemplate(libraryPath: string) {
    return `cp rigs/repo-scripts/templates/tsconfig.json ${libraryPath}/tsconfig.json`
}

function addPublishArtifact(libraryPath: string) {
    return `cd ${libraryPath} && git add --all && git commit -m "Add publish artifact"`
}

function executePublish() {
    return `pnpm publish`
}

function removePublishArtifact() {
    return `mv ~/tmpfile tsconfig.json && git add --all && git commit -m "Remove publish artifact" && git push`
}

function publishPackage(libraryPath: string) {
    execSync(
        `${saveBackupTsconfig(libraryPath)} && 
         ${useTsconfigTemplate(libraryPath)} && 
         ${addPublishArtifact(libraryPath)} && 
         ${executePublish()} && 
         ${removePublishArtifact()}`, 
        { 
            stdio: "inherit" 
        }
    )
}

function run() {
    const packagePath = getPackagePath(`@volley/${process.argv[3]}`)
    publishPackage(packagePath)
}

run()