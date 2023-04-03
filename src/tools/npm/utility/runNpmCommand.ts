import { exec } from "child_process"

export async function runNpmCommand(
  script: string,
  cwd: string
): Promise<string> {
  // Validate that 'script' doesn't contain ; or &
  if (script.includes(";") || script.includes("&")) {
    return `ERROR: Invalid npm script: ${script}`
  }

  return new Promise((resolve, reject) => {
    // Execute the npm command in the provided working directory
    exec(`npm run ${script}`, { cwd }, (error, stdout, stderr) => {
      if (error) {
        const errorMessage = `ERROR: Failed to run npm command: ${script}\n${stderr}`
        console.error(errorMessage)
        resolve(errorMessage)
      } else {
        const successMessage = `Successfully ran npm command: ${script}\n${stdout}`
        resolve(successMessage)
      }
    })
  })
}
