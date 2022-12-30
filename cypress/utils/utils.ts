import {
    appsPath,
    MINUTE,
    rulesAndLabelPath,
    SEC,
    serverPath,
    upload,
} from "../e2e/types/constants";
import { projectData } from "../e2e/types/types";
import { chooseProject, pageTab } from "../e2e/views/common.view";
import * as data from "../utils/data_utils";
import { navMenu } from "../e2e/views/menu.view";
import { isExplodedCheckBox, serverPathInput } from "../e2e/views/projects.view";

let userName = Cypress.env("user");
let userPassword = Cypress.env("pass");
const windupUiUrl = Cypress.env("windupUrl");
const workspaceUrl = Cypress.env("workspaceUrl");
const { _ } = Cypress;

export function inputText(fieldId: string, text: any): void {
    cy.get(fieldId).click().focused().clear();
    cy.wait(200);
    cy.get(fieldId).clear().type(text);
}

export function clearInput(fieldID: string): void {
    cy.get(fieldID).clear();
}

export function clickByText(fieldId: string, buttonText: string, isForced = true): void {
    // https://github.com/cypress-io/cypress/issues/2000#issuecomment-561468114
    cy.wait(SEC);
    cy.contains(fieldId, buttonText, { timeout: 120 * SEC }).click({
        force: isForced,
    });
    cy.wait(SEC);
}

export function shouldBeEnabled(fieldId: string, buttonText: string): void {
    cy.wait(SEC);
    cy.contains(fieldId, buttonText, { timeout: 120 * SEC }).should("be.enabled");
    cy.wait(SEC);
}

export function click(fieldId: string, isForced = true): void {
    cy.get(fieldId, { timeout: 120 * SEC }).click({ force: isForced });
}

//TODO: Login functionality for secure URL
export function login(username?, password?: string): void {
    cy.visit(windupUiUrl, { timeout: 120 * SEC });
    cy.wait(5000);
}

export function selectFromDropList(dropList, item: string) {
    click(dropList);
    click(item);
}

export function selectFromDropListByText(droplist, item: string) {
    click(droplist);
    clickByText("button", item);
}

export function selectFormItems(fieldId: string, item: string): void {
    cy.get(fieldId).click();
    cy.contains("button", item).click();
}

export function uploadApplications(fileName: string): void {
    // Uplaod any file
    cy.get('input[type="file"]', { timeout: 5 * SEC }).attachFile(
        { filePath: fileName, encoding: "binary" },
        { subjectType: "drag-n-drop" }
    );
    cy.wait(2000);
}

export function navigateTo(page: string): void {
    clickByText(navMenu, page);
    cy.wait(10000);
}

export function importFile(app: string): void {
    clickByText(pageTab, upload);
    cy.get('input[type="file"]', { timeout: 5 * SEC }).invoke("show");
    cy.get('input[type="file"]', { timeout: 5 * SEC }).selectFile(app, {
        action: "drag-drop",
    });

    cy.wait(SEC);
}

// Perform edit/delete action on the specified row selector by clicking a text button
export function performRowAction(itemName: string, action: string): void {
    // itemName is text to be searched on the screen (like credentials name, stakeholder name, etc)
    // Action is the name of the action to be applied (usually edit or delete)

    cy.get("td", { timeout: 120 * SEC })
        .contains(itemName, { timeout: 120 * SEC })
        .closest("tr")
        .within(() => {
            clickByText("button", action);
            cy.wait(500);
            clickByText("button", action);
        });
}

export function performRowActionByIcon(itemName: string, action: string): void {
    // itemName is the text to be searched on the screen (For eg: application name, etc)
    // Action is the name of the action to be applied (For eg: edit or click kebab menu)
    cy.contains(itemName, { timeout: 120 * SEC })
        .closest("tr")
        .within(() => {
            click(action);
        });
}

export function selectProject(projectName: string): void {
    click(chooseProject);
    clickByText("button", projectName);
}

export function getRandomApplicationData(applicationData): projectData {
    applicationData["name"] = applicationData["name"] + "_" + data.getProjectName();
    applicationData["desc"] = data.getDescription();

    for (let index = 0; index < applicationData["apps"].length; index++) {
        applicationData["apps"][index] = appsPath + applicationData["apps"][index];
    }

    if (applicationData["customRules"]) {
        for (let index = 0; index < applicationData["customRules"].length; index++) {
            applicationData["customRules"][index] =
                rulesAndLabelPath + applicationData["customRules"][index];
        }
    }

    if (applicationData["customLabels"]) {
        for (let index = 0; index < applicationData["customLabels"].length; index++) {
            applicationData["customLabels"][index] =
                rulesAndLabelPath + applicationData["customLabels"][index];
        }
    }

    return applicationData;
}

export function trimAppNames(apps: string[]): string[] {
    let index = 0;
    for (index = 0; index < apps.length; index++) {
        let temp = apps[index].split("/");
        apps[index] = temp[temp.length - 1];
    }

    return apps;
}

export function addServerPath(path: string): void {
    cy.wait(SEC);
    clickByText(pageTab, serverPath);
    inputText(serverPathInput, workspaceUrl + "/" + path);
    click(isExplodedCheckBox);
    cy.wait(SEC);
}
