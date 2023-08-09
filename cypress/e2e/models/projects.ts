import {
    addServerPath,
    click,
    clickByText,
    enableOption,
    importFile,
    inputText,
    navigateTo,
    performRowActionByIcon,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addApplicationsPage,
    addLabel,
    addRule,
    advancedOptionsPage,
    back,
    close,
    createProject,
    customLabels,
    customRules,
    deleteButton,
    eapCard,
    editButton,
    MINUTE,
    next,
    projectDelete,
    projectDetailsPage,
    projects,
    reviewPage,
    save,
    saveAndRun,
    SEC,
    selectPackages,
    selectTransformationTarget,
} from "../types/constants";
import { advancedOptionsData, projectData } from "../types/types";
import { dangerButton, kebabMenu, primaryButton, secondaryButton } from "../views/common.view";
import {
    advancedOptionSwitch,
    deleteProjectInput,
    enableRuleSwitch,
    inputSources,
    packageSwitch,
    projectAppColumn,
    projectDescriptionColumn,
    projectDescriptionInput,
    projectNameColumn,
    projectNameInput,
    projectSearchInput,
    projectTableFilterButtons,
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
    openCreateWizard(): void {
        cy.contains(primaryButton, createProject, { timeout: 20000 }).should("be.enabled").click();
    }

    //Function to input the project name (mandatory) and description (optional)
    enterProjectDetails(name: string, desc?: string): void {
        cy.contains("h5", projectDetailsPage, { timeout: 120 * SEC });

        inputText(projectNameInput, this.name);
        if (desc) inputText(projectDescriptionInput, this.desc);

        shouldBeEnabled(primaryButton, next);
        cy.wait(10 * SEC);
        clickByText(primaryButton, next);
    }

    //Function to attach the binary files or providing the project server path to analyse
    addApplications(apps: string[]): void {
        //TODO: Add validation that "Add Applications" page is reached
        cy.contains("h5", addApplicationsPage, { timeout: 120 * SEC });
        //TODO: Add "Server path" support to this function.

        apps.forEach(function (app) {
            if (app.includes(".war") || app.includes(".ear") || app.includes(".jar")) {
                importFile(app);
            } else {
                addServerPath(app);
                clickByText(primaryButton, next);
                cy.wait(10 * SEC);
                clickByText(secondaryButton, back);
            }
        });
        cy.wait(MINUTE);
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to get all the target technologies one by one and send for selection
    selectTarget(targets: string[]): void {
        //TODO: Add validation that "Select Target" page is reached
        cy.contains("h5", selectTransformationTarget, { timeout: 120 * SEC });
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
        cy.contains("h5", selectPackages, { timeout: 120 * SEC });

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
        cy.contains("h5", customRules, { timeout: 120 * SEC });
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
        cy.contains("h5", customLabels, { timeout: 120 * SEC });
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
        cy.contains("h5", advancedOptionsPage, { timeout: 120 * SEC });
        if (advancedOptions) {
            if (advancedOptions.sources) {
                advancedOptions.sources.forEach((source) => {
                    inputText(inputSources, source);
                    clickByText("button", source);
                    click(inputSources);
                });
            }
            cy.wait(10 * SEC);
            if (advancedOptions.options)
                advancedOptions.options.forEach((option) => enableOption(option));
        }

        //TODO: Add support for other options
        shouldBeEnabled(primaryButton, next);
        clickByText(primaryButton, next);
    }

    //Function to only save the project using Save button.
    saveProject(): void {
        //TODO: Add validation that "Review" page is reached
        shouldBeEnabled(primaryButton, save);
        clickByText(primaryButton, save);
        cy.contains("h1", projects, { timeout: 120 * SEC });
        cy.wait(20 * SEC);
    }

    //Function to save the project and also run the analysis using SaveAndRun button.
    saveProjectAndRunAnalysis(): void {
        //TODO: Add validation that "Review" page is reached
        cy.contains("h5", reviewPage, { timeout: 120 * SEC });
        shouldBeEnabled(primaryButton, saveAndRun);
        clickByText(primaryButton, saveAndRun);
        cy.wait(MINUTE / 2);
    }

    //TODO: Function to edit a project
    editProject(newName: string, newDesc: string) {
        cy.wait(SEC);
        navigateTo(projects);
        performRowActionByIcon(this.name, kebabMenu);
        clickByText("button", editButton);

        inputText(projectNameInput, newName);
        inputText(projectDescriptionInput, newDesc);
        shouldBeEnabled(primaryButton, save);
        clickByText(primaryButton, save);
    }

    // Function to validate a project
    validateProject(name: string, desc?: string, applications?: string) {
        cy.wait(SEC);
        navigateTo(projects);
        cy.contains(name, { timeout: 120 * SEC })
            .closest("tr")
            .within(() => {
                cy.get(projectNameColumn + " > a").should("have.text", name);

                if (desc) {
                    cy.get(projectDescriptionColumn).should("have.text", desc);
                }

                if (applications) {
                    cy.get(projectAppColumn).should("have.text", applications);
                }
            });
    }

    // Function to delete a project
    static delete(project: string): void {
        cy.wait(SEC);
        navigateTo(projects);
        performRowActionByIcon(project, kebabMenu);
        clickByText("button", deleteButton);
        cy.contains("span", projectDelete, { timeout: 120 * SEC });
        inputText(deleteProjectInput, project);
        shouldBeEnabled(dangerButton, deleteButton);
        clickByText(dangerButton, deleteButton);
        cy.wait(10 * SEC);
    }
    // Function to Search a project
    static searchProject(projectName: string): void {
        cy.wait(SEC);
        navigateTo(projects);
        inputText(projectSearchInput, projectName);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(projectNameColumn)
            .find("a")
            .first()
            .then(($a) => {
                expect($a.text()).to.eq(projectName);
            });
    }

    static sortProjectsBy(buttonText: string): void {
        cy.wait(SEC);
        clickByText(projectTableFilterButtons, buttonText);
        cy.wait(SEC);
    }

    static matchProjectOrder(projects: string[]) {
        let index = 0;
        for (index = 0; index < projects.length; index++) {
            cy.get(projectNameColumn + " > a")
                .eq(index)
                .should("have.text", projects[index]);
        }
    }

    static deleteAllProjects() {
        cy.get(projectNameColumn + " > a").each(($project) => {
            Projects.delete($project.text());
            cy.wait(20 * SEC);
        });
    }
}
