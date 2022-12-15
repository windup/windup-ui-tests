import {
    click,
    clickByText,
    importApp,
    inputText,
    navigateTo,
    selectFromDropListByText,
} from "../../../utils/utils";
import {
    createProject,
    disableTattletale,
    eapCard,
    next,
    projects,
    save,
    saveAndRun,
    SEC,
} from "../../types/constants";
import { advancedOptionsData, projectData } from "../../types/types";
import { primaryButton } from "../../views/common.view";
import {
    advancedOptionSwitch,
    packageSwitch,
    projectDescriptionInput,
    projectNameInput,
    targetOptions,
} from "../../views/projects.view";

export class Projects {
    name: string;
    desc?: string;
    apps: string[];
    targets: string[];
    excludePackages?: string[];
    includePackages?: string[];
    customRules?: string[];
    customLabels?: string[];
    advancedOptions?: advancedOptionsData;

    constructor(projectDetails: projectData) {
        this.init(projectDetails);
    }

    protected init(projectDetails: projectData) {
        const {
            name,
            desc,
            apps,
            targets,
            excludePackages,
            includePackages,
            customRules,
            customLabels,
            advancedOptions,
        } = projectDetails;
        this.name = name;
        if (desc) this.desc = desc;
        if (apps) this.apps = apps;
        if (targets) this.targets = targets;
        if (excludePackages) this.excludePackages = excludePackages;
        if (includePackages) this.includePackages = includePackages;
        if (customRules) this.customRules = customRules;
        if (customLabels) this.customLabels = customLabels;
        if (advancedOptions) this.advancedOptions = advancedOptions;
    }

    create(): void {
        navigateTo(projects);
        this.openCreateWizard();
        this.enterProjectDetails(this.name, this.desc);
        this.addApplications(this.apps);
        this.selectTarget(this.targets);
        this.selectPackages(this.excludePackages, this.includePackages);
        this.addCustomRules(this.customRules);
        this.addCustomLabels(this.customLabels);
        this.enableAdvancedOptions(this.advancedOptions);
        this.saveProjectAndRunAnalysis();
    }

    protected openCreateWizard(): void {
        cy.contains(primaryButton, createProject, { timeout: 20000 }).should("be.enabled").click();
    }

    enterProjectDetails(name: string, desc: string): void {
        inputText(projectNameInput, this.name);

        if (desc) inputText(projectDescriptionInput, this.desc);

        clickByText(primaryButton, next);
    }

    addApplications(apps: string[]): void {
        apps.forEach((app) => importApp(app));

        clickByText(primaryButton, next);
    }

    selectTarget(targets: string[]): void {
        clickByText("h4", eapCard);
        targets.forEach((target) => this.selectCard(target));

        clickByText(primaryButton, next);
    }

    selectCard(target: string): void {
        if (target.includes("eap")) {
            //cy.get(targetOptions).contains("eap7").click({force: true});
            clickByText(targetOptions, "eap");
            clickByText("button", target);
        } else if (target.includes("openjdk")) {
            clickByText(targetOptions, "openjdk");
            clickByText("button", target);
        } else if (target.includes("azure")) {
            clickByText(targetOptions, "azure");
            clickByText("button", target);
        } else {
            clickByText("h4", target);
        }
    }

    selectPackages(excludePackages: string[], includePackages: string[]): void {
        if (excludePackages || includePackages) {
            click(packageSwitch);
        }

        clickByText(primaryButton, next);
    }

    addCustomRules(rules: string[]): void {
        if (rules) {
            //Add rule Functionality
        }

        clickByText(primaryButton, next);
    }

    addCustomLabels(labels: string[]): void {
        if (labels) {
            //Add Label Functionality
        }

        clickByText(primaryButton, next);
    }

    enableAdvancedOptions(advancedOptions: advancedOptionsData): void {
        advancedOptions.options.forEach((option) => this.enableOption(option));

        clickByText(primaryButton, next);
    }

    enableOption(option: string): void {
        const optionSelector = advancedOptionSwitch + "[aria-label='" + option + "']";
        click(optionSelector);

        cy.wait(SEC);
    }

    saveProject(): void {
        clickByText(primaryButton, save);
    }

    saveProjectAndRunAnalysis(): void {
        clickByText(primaryButton, saveAndRun);
    }
}
