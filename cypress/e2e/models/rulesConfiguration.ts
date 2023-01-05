import {
    clickByText,
    importFile,
    navigateTo,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addRule,
    browse,
    close,
    customRules,
    rulesConfiguration,
    systemRules,
} from "../types/constants";
import { pageTab, primaryButton } from "../views/common.view";

export class RulesConfiguration {
    projectName: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        navigateTo(rulesConfiguration);
        selectProject(this.projectName);
    }

    addGlobalCustomRules(rule: string): void {
        clickByText(pageTab, customRules);
        shouldBeEnabled(primaryButton, addRule);
        clickByText(primaryButton, addRule);
        shouldBeEnabled(primaryButton, browse);
        importFile(rule);
        shouldBeEnabled(primaryButton, close);
        clickByText(primaryButton, close);
    }
}
