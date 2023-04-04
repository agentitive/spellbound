import { execSync } from "child_process"
import { allLibraries } from "./utils"


function executePublish(libPath: string) {
    return `cd libs/${libPath} && pnpm publish`
}

function run() {
    const libs = allLibraries()

    for (const lib of libs) {
        execSync(
            `${executePublish(lib.unscopedTempProjectName)} && 
            cd ../../`,
            { 
                stdio: "inherit" 
            }
        )
    }
}

run()