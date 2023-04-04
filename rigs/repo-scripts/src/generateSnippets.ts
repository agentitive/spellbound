import fs from "fs";
import { parse, resolve } from "path";

export function generateSnippets() {
    const snippetsFiles = readSnippetsDirectory()
    const snippetDefinitions = generateSnippetDefinitions(snippetsFiles)
    const snippetsContents = buildSnippetsContents(snippetDefinitions)
    const snippetsFilepath = getSnippetsFilepath()
    fs.writeFileSync(snippetsFilepath, snippetsContents);
}

function readSnippetsDirectory() {
    const snippetsDirectory = resolve("../../", ".vscode/snippets")
    const snippetsFiles = fs.readdirSync(snippetsDirectory)
    return snippetsFiles
}

function generateSnippetDefinitions(snippetsFiles: string[]): Record<string, unknown> {
    return snippetsFiles.reduce(parseSnippet, {}) as Record<string, unknown>
}

function parseSnippet(allSnippetDefinitions: {}, filename: string) {
    const [prefix, description, ...lines] = readAndParseSnippetFile(filename)

    const cleanedPrefix = extractPrefix(prefix)
    const cleanedDescription = extractDescription(description)
    const snippetTemplateBody = generateSnippetTemplateBody(cleanedPrefix, cleanedDescription, lines);
    const snippetName = parse(filename).name;

    return { ...allSnippetDefinitions, [snippetName]: snippetTemplateBody };
}

function readAndParseSnippetFile(filename: string) {
    const snippetText = fs.readFileSync(`../../.vscode/snippets/${filename}`, "utf8");
    const [prefix, description, ...lines] = snippetText.split("\n");
    return [prefix, description, ...lines]
}

function extractPrefix(prefix: string) {
    return prefix.replace(/^(\/\/\s*)?prefix\:\s*/, "")
}

function extractDescription(description: string) {
    return description.replace(/^(\/\/\s*)?description\:\s*/, "")
}

function generateSnippetTemplateBody(prefix: string, description: string, body: string[]) {
    return {
        scope: "javascript,typescript",
        prefix,
        body,
        description,
    };
}

function buildSnippetsContents(snippetDefinitions: Record<string, unknown>) {
    return JSON.stringify(snippetDefinitions, null, 2);
}

function getSnippetsFilepath() {
    return resolve("../../", ".vscode/solid-monorepo.code-snippets")
}

generateSnippets()