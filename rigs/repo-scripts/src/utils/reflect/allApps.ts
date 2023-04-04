import { allProjects } from "./allProjects";

export function allApps() {
    const projects = allProjects()
    return projects.filter(p => p.projectRelativeFolder.startsWith("apps"));
}