import {
    clickByText,
    importFile,
    navigateTo,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import { addLabel, browse, close, customLabels, labelsConfiguration } from "../types/constants";
import { pageTab, primaryButton } from "../views/common.view";

export class LabelsConfiguration {
    projectName: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        navigateTo(labelsConfiguration);
        selectProject(this.projectName);
    }

    addGlobalCustomLabels(label: string): void {
        clickByText(pageTab, customLabels);
        shouldBeEnabled(primaryButton, addLabel);
        clickByText(primaryButton, addLabel);
        shouldBeEnabled(primaryButton, browse);
        importFile(label);
        shouldBeEnabled(primaryButton, close);
        clickByText(primaryButton, close);
    }
}
