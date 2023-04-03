import { promises as fs } from "fs"
import path from "path"

export async function collectFiles(
  directory: string,
  filterFunction: (file: string) => boolean,
  recursive: boolean,
  collected?: string[] // for internal recursive use
): Promise<string[] | string> {
  if (!collected) {
    collected = []
  }

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory() && recursive) {
        await collectFiles(entryPath, filterFunction, recursive, collected)
      } else if (entry.isFile()) {
        if (filterFunction(entryPath)) {
          collected.push(entryPath)
        }
      }
    }
  } catch (err) {
    return `ERROR: Failed to read directory contents: ${err}`
  }

  return collected
}
