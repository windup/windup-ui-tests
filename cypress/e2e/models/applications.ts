import {
    clickByText,
    importFile,
    navigateTo,
    performRowActionByIcon,
    selectProject,
} from "../../utils/utils";
import { addApplication, applications, close, deleteButton, SEC } from "../types/constants";
import { tableBody } from "../views/applications.view";
import { dangerButton, kebabMenu, primaryButton, trTag } from "../views/common.view";

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
    deleteApplication(app: string): void {
        cy.wait(SEC);
        performRowActionByIcon(app, kebabMenu);
        clickByText("button", deleteButton);
        clickByText(dangerButton, deleteButton);
    }

    validateAppCount(count: number): void {
        cy.get(tableBody)
            .find(trTag)
            .then((row) => {
                expect(row.length).to.equal(count);
            });
    }
}
