import { RushConfiguration } from "@microsoft/rush-lib";

export function allProjects() {
    const conf = RushConfiguration.loadFromDefaultLocation({
        startingFolder: process.cwd()
    });
    return conf.projects
}