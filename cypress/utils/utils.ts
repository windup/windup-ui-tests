import { SEC } from "../e2e/types/constants";
import { projectData } from "../e2e/types/types";
import { chooseProject } from "../e2e/views/common.view";
import { primaryButton } from "../e2e/views/common.view";
import { navMenu } from "../e2e/views/menu.view";

let userName = Cypress.env("user");
let userPassword = Cypress.env("pass");
const windupUiUrl = Cypress.env("windupUrl");
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

export function importApp(app: string): void {
    cy.get('input[type="file"]', { timeout: 5 * SEC }).invoke("show");
    cy.get('input[type="file"]', { timeout: 5 * SEC }).selectFile(app, {
        action: "drag-drop",
    });

    cy.wait(2000);
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
