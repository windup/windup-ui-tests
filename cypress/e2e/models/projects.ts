import {
    click,
    clickByText,
    importFile,
    inputText,
    navigateTo,
    performRowAction,
    performRowActionByIcon,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addLabel,
    addRule,
    close,
    createProject,
    deleteButton,
    disableTattletale,
    eapCard,
    next,
    projects,
    save,
    saveAndRun,
    SEC,
} from "../types/constants";
import { advancedOptionsData, projectData } from "../types/types";
import { dangerButton, kebabMenu, primaryButton } from "../views/common.view";
import {
    advancedOptionSwitch,
    deleteProjectInput,
    enableRuleSwitch,
    packageSwitch,
    projectDescriptionInput,
    projectNameInput,
    targetOptions,
} from "../views/projects.view";

//This class represents the "Projects" page and related functionalities in the Windup UI
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

    //Just another constructor ;)
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

    //This function clicks on the create wizard and goes through all the pages of that wizard using the object's data
    create(run_analysis = false): void {
        navigateTo(projects);
        this.openCreateWizard();
        this.enterProjectDetails(this.name, this.desc);
        this.addApplications(this.apps);
        this.selectTarget(this.targets);
        this.selectPackages(this.excludePackages, this.includePackages);
        this.addCustomRules(this.customRules);
        this.addCustomLabels(this.customLabels);
        this.enableAdvancedOptions(this.advancedOptions);
        if (run_analysis) this.saveProjectAndRunAnalysis();
        else this.saveProject();
    }

    //Function to click on "Create wizard"
    protected openCreateWizard(): void {
        cy.contains(primaryButton, createProject, { timeout: 20000 }).should("be.enabled").click();
    }

    //Function to input the project name (mandatory) and description (optional)
    enterProjectDetails(name: string, desc?: string): void {
        //TODO: Add validation that "Project Details" page is reached

        inputText(projectNameInput, this.name);
        if (desc) inputText(projectDescriptionInput, this.desc);

        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to attach the binary files or providing the project server path to analyse
    addApplications(apps: string[]): void {
        //TODO: Add validation that "Add Applications" page is reached
        //TODO: Add "Server path" support to this function.

        apps.forEach((app) => importFile(app));
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to get all the target technologies one by one and send for selection
    selectTarget(targets: string[]): void {
        //TODO: Add validation that "Select Target" page is reached

        clickByText("h4", eapCard);
        targets.forEach((target) => this.selectCard(target));

        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to select the given target in the UI
    selectCard(target: string): void {
        if (target.includes("eap")) {
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

    //Function to exclude or include some packages for analysis (Both Optional)
    selectPackages(excludePackages?: string[], includePackages?: string[]): void {
        //TODO: Add validation that "Select Packages" page is reached

        if (excludePackages || includePackages) {
            click(packageSwitch);
            //TODO: Add functionality to exclude or include the provided packages
        }
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to provide some custom rules to be used in the analysis (Optional)
    addCustomRules(rules?: string[]): void {
        //TODO: Add validation that "Custom rules" page is reached
        //TODO: Add "Server path" support to this function.

        if (rules) {
            clickByText(primaryButton, addRule);
            rules.forEach((rule) => importFile(rule));
            clickByText(primaryButton, close);
            cy.get(enableRuleSwitch).each(($switch) => {
                cy.wrap($switch).click({ force: true });
                cy.wait(SEC);
            });
        }
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to provide some custom labels to be used in the analysis (Optional)
    addCustomLabels(labels?: string[]): void {
        //TODO: Add validation that "Custom Labels" page is reached
        if (labels) {
            clickByText(primaryButton, addLabel);
            labels.forEach((label) => importFile(label));
            clickByText(primaryButton, close);
            cy.get(enableRuleSwitch).each(($switch) => {
                cy.wrap($switch).click({ force: true });
                cy.wait(SEC);
            });
        }
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to select the advanced options and enable those one by one (Optional)
    enableAdvancedOptions(advancedOptions?: advancedOptionsData): void {
        //TODO: Add validation that "Advanced options" page is reached
        if (advancedOptions)
            if (advancedOptions.options)
                advancedOptions.options.forEach((option) => this.enableOption(option));

        //TODO: Add support for other options
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to enable the advanced options using toggle switch like exportcsv, sourceMode, etc.
    enableOption(option: string): void {
        const optionSelector = advancedOptionSwitch + "[aria-label='" + option + "']";
        click(optionSelector);
        cy.wait(SEC);
    }

    //Function to only save the project using Save button.
    saveProject(): void {
        //TODO: Add validation that "Review" page is reached
        shouldBeEnabled(primaryButton, save);
        clickByText(primaryButton, save);
    }

    //Function to save the project and also run the analysis using SaveAndRun button.
    saveProjectAndRunAnalysis(): void {
        //TODO: Add validation that "Review" page is reached
        shouldBeEnabled(primaryButton, saveAndRun);
        clickByText(primaryButton, saveAndRun);
    }

    //TODO: Function to edit a project

    //TODO: Function to delete a project
    deleteProject(project: string): void {
        cy.wait(SEC);
        performRowActionByIcon(project, kebabMenu);
        clickByText("button", deleteButton);

        inputText(deleteProjectInput, project);
        shouldBeEnabled(dangerButton, deleteButton);
        clickByText(dangerButton, deleteButton);
    }
    //TODO: Function to Validate Project is created
    validateProjectCreation(): void {}
}
