import fs from "fs"
import path from "path"
import { getCurrentWorkspaceFolder } from "./getCurrentWorkspaceFolder"

export const IGNORED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".mp3",
  ".mp4",
  ".mov",
  ".avi",
  ".zip",
  ".gz",
  ".tar",
  ".tgz",
  ".bz2",
  ".rar",
  ".7z",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".odt",
  ".ods",
]

export type Chunk = {
  filename: string
  start: number
  end: number
  text: string
  embedding: number[] | null
}

export const chunkFile = (
  filename: string,
  block_size: number,
  block_overlap: number
) => {
  if (IGNORED_EXTENSIONS.includes(path.extname(filename))) {
    return []
  }

  console.log("chunking file", filename)
  const content = fs.readFileSync(filename, "utf8")

  const chunks: Chunk[] = []
  let start = 0
  let end = block_size
  let overlap = block_overlap

  while (start < content.length) {
    if (end > content.length) {
      end = content.length
    }

    const relativeFilename = path.relative(
      getCurrentWorkspaceFolder(),
      filename
    )

    chunks.push({
      filename: relativeFilename,
      start,
      end,
      text: content.substring(start, end),
      embedding: null,
    })

    if (end === content.length) {
      break
    }

    start = end - overlap
    end = start + block_size
  }

  return chunks
}

export const chunkFiles = (
  filenames: string[],
  block_size: number,
  block_overlap: number
) => {
  return filenames.flatMap((filename) =>
    chunkFile(filename, block_size, block_overlap)
  )
}

export const chunkFolder = (
  folder: string,
  block_size: number,
  block_overlap: number
): Chunk[] => {
  const names = fs.readdirSync(folder)

  // ignore hidden files and node_modules
  const filteredNames = names
    .filter((f) => !f.startsWith("."))
    .filter((f) => f !== "node_modules")

  const fullNames = filteredNames.map((f) => path.join(folder, f))

  const files = fullNames
    .filter((f) => fs.statSync(f).isFile())
    .filter((f) => !IGNORED_EXTENSIONS.includes(path.extname(f)))

  const dirs = fullNames.filter((f) => fs.statSync(f).isDirectory())

  const chunks = chunkFiles(files, block_size, block_overlap)
  const childChunks = dirs.flatMap((d) =>
    chunkFolder(d, block_size, block_overlap)
  )

  return chunks.concat(childChunks)
}
