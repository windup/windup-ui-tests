import {
    clickByText,
    importFile,
    inputText,
    navigateTo,
    performRowActionByIcon,
    selectProject,
} from "../../utils/utils";
import {
    addApplication,
    applications,
    cancelButton,
    close,
    deleteButton,
    SEC,
} from "../types/constants";
import {
    appNameColumn,
    appSearchInput,
    appTableFilterButtons,
    tableBody,
} from "../views/applications.view";
import { dangerButton, kebabMenu, linkButton, primaryButton, trTag } from "../views/common.view";
import {
    projectNameColumn,
    projectSearchInput,
    projectTableFilterButtons,
} from "../views/projects.view";

export class Applications {
    projectName: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        navigateTo(applications);
        selectProject(this.projectName);
    }

    //TODO: Function to add support to add application using server path

    //Function to import applications to existing projects
    addApplication(apps: string[]) {
        this.openAddApplication();
        apps.forEach((app) => importFile(app));
        clickByText(primaryButton, close);
    }

    openAddApplication() {
        clickByText(primaryButton, addApplication);
        //TODO: Add validation that wizard is open
    }

    //Function to delete application from an existing project
    delete(app: string, cancel = false): void {
        cy.wait(SEC);
        performRowActionByIcon(app, kebabMenu);
        clickByText("button", deleteButton);

        if (cancel) {
            clickByText(linkButton, cancelButton);
            cy.wait(10 * SEC);
            cy.contains("h1", applications, { timeout: 120 * SEC });
        } else {
            clickByText(dangerButton, deleteButton);
        }
    }

    validateAppCount(count: number): void {
        cy.get(tableBody)
            .find(trTag)
            .then((row) => {
                expect(row.length).to.equal(count);
            });
    }

    // Function to Search an application
    search(appName: string): void {
        cy.wait(SEC);
        navigateTo(applications);
        inputText(appSearchInput, appName);
        cy.wait(SEC);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(appNameColumn)
            .find("a")
            .first()
            .then(($a) => {
                expect($a.text()).to.eq(appName);
            });
    }

    sortAppsBy(buttonText: string): void {
        cy.wait(SEC);
        clickByText(appTableFilterButtons, buttonText);
        cy.wait(SEC);
    }

    matchAppsOrder(apps: string[]) {
        let index = 0;
        for (index = 0; index < apps.length; index++) {
            cy.get(appNameColumn + " > a")
                .eq(index)
                .should("have.text", apps[index]);
        }
    }
}
