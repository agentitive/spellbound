import { allProjects } from "./allProjects";

export function allLibraries() {
    const projects = allProjects()
    return projects.filter(p => p.projectRelativeFolder.startsWith("libs"));
}