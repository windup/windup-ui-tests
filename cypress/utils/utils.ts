import { SEC } from "../e2e/types/constants";
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
