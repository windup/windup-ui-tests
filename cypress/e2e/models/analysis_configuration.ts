import { navigateTo, selectProject } from "../../utils/utils";
import { analysisConfiguration } from "../types/constants";

export class AnalysisConfiguration {
    projectName: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        navigateTo(analysisConfiguration);
        selectProject(this.projectName);
    }

    //TODO: Add function to modify targets

    //TODO: Add function to modify packages

    //TODO: Add function to modify rules

    //TODO: Add function to modify labels

    //TODO: Add function to modify advanced options
}
