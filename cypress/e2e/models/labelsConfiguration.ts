import {
    click,
    clickByText,
    importFile,
    inputText,
    navigateTo,
    performRowActionByIcon,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addLabel,
    browse,
    cancelButton,
    close,
    customLabels,
    deleteButton,
    labelsConfiguration,
    MINUTE,
    SEC,
    systemLabels,
} from "../types/constants";
import {
    dangerButton,
    kebabMenu,
    linkButton,
    pageTab,
    primaryButton,
    tableBody,
    trTag,
} from "../views/common.view";
import {
    customLabelsSearch,
    labelProviderIDColumn,
    labelShortPathColumn,
    numLabelsColumn,
    systemLabelsSearch,
} from "../views/labelsConfiguration.view";

export class LabelsConfiguration {
    constructor() {
        navigateTo(labelsConfiguration);
    }

    add(label: string): void {
        clickByText(pageTab, customLabels);
        shouldBeEnabled(primaryButton, addLabel);
        clickByText(primaryButton, addLabel);
        shouldBeEnabled(primaryButton, browse);
        importFile(label);
        shouldBeEnabled(primaryButton, close);
        clickByText(primaryButton, close);
    }

    search(label: string) {
        navigateTo(labelsConfiguration);
        clickByText(pageTab, customLabels);
        inputText(customLabelsSearch, label);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(labelShortPathColumn + " > span")
            .find("span")
            .first()
            .then(($a) => {
                expect($a.text()).to.eq(label);
            });
    }

    validateCount(count: number): void {
        cy.wait(MINUTE / 2);
        cy.get(tableBody)
            .find(trTag)
            .then((row) => {
                expect(row.length).to.equal(count);
            });
    }

    validateLabels(count) {
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(numLabelsColumn)
            .first()
            .then(($col) => {
                expect($col.text()).to.eq(count.toString());
            });
    }

    validateSysLabelCount(count) {
        cy.wait(SEC);
        navigateTo(labelsConfiguration);
        clickByText(pageTab, systemLabels);
        this.validateLabels(count);
    }

    searchSysLabels(label: string) {
        navigateTo(labelsConfiguration);
        clickByText(pageTab, systemLabels);
        inputText(systemLabelsSearch, label);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(labelProviderIDColumn)
            .first()
            .then(($a) => {
                expect($a.text()).to.eq(label);
            });
    }

    delete(label: string, cancel = false): void {
        cy.wait(SEC);
        navigateTo(labelsConfiguration);
        clickByText(pageTab, customLabels);
        performRowActionByIcon(label, kebabMenu);
        clickByText("button", deleteButton);
        cy.wait(5 * SEC);
        shouldBeEnabled(dangerButton, deleteButton);
        if (cancel) {
            clickByText(linkButton, cancelButton);
        } else {
            clickByText(dangerButton, deleteButton);
        }

        cy.wait(10 * SEC);
    }

    deleteAllLabels() {
        cy.get(labelShortPathColumn + " > span > span").each(($label) => {
            this.delete($label.text());
            cy.wait(20 * SEC);
        });
    }
}
