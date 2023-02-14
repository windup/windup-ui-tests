import {
    clickByText,
    enableOption,
    importFile,
    inputText,
    navigateTo,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addRule,
    advancedOptionsPage,
    analysisConfiguration,
    close,
    customRules,
    next,
    runAnalysisButton,
    save,
    SEC,
} from "../types/constants";
import { advancedOptionsData } from "../types/types";
import { pageTab, primaryButton, secondaryButton } from "../views/common.view";
import { enableRuleSwitch, inputSources } from "../views/projects.view";

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
    addNewRule(rule: string): void {
        clickByText(pageTab, customRules);
        cy.wait(10 * SEC);
        cy.contains("h5", customRules, { timeout: 120 * SEC });
        if (rule) {
            clickByText(primaryButton, addRule);
            importFile(rule);
            clickByText(primaryButton, close);
            cy.get(enableRuleSwitch).each(($switch) => {
                cy.wrap($switch).click({ force: true });
                cy.wait(SEC);
            });
        }
    }

    runAnalysis(): void {
        cy.wait(10 * SEC);
        shouldBeEnabled(secondaryButton, runAnalysisButton);
        clickByText(secondaryButton, runAnalysisButton);
        cy.wait(10 * SEC);
    }

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
