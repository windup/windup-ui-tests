import {
    clickByText,
    enableOption,
    inputText,
    navigateTo,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import { advancedOptionsPage, analysisConfiguration, next, save, SEC } from "../types/constants";
import { advancedOptionsData } from "../types/types";
import { pageTab, primaryButton } from "../views/common.view";
import { inputSources } from "../views/projects.view";

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
    modifyAdvancedOptions(advancedOptions?: advancedOptionsData): void {
        clickByText(pageTab, advancedOptionsPage);
        cy.wait(10 * SEC);
        cy.contains("h5", advancedOptionsPage, { timeout: 120 * SEC });
        if (advancedOptions) {
            if (advancedOptions.sources) {
                advancedOptions.sources.forEach((source) => {
                    inputText(inputSources, source);
                    clickByText("button", source);
                });
            }
            if (advancedOptions.options)
                advancedOptions.options.forEach((option) => enableOption(option));
        }

        //TODO: Add support for other options
        shouldBeEnabled(primaryButton, save);
        clickByText(primaryButton, save);
    }
}
