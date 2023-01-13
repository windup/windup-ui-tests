import {
    clickByText,
    importFile,
    inputText,
    navigateTo,
    performRowActionByIcon,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    addRule,
    browse,
    cancelButton,
    close,
    customRules,
    deleteButton,
    MINUTE,
    rulesConfiguration,
    SEC,
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
import { customRulesSearch, ruleShortPathColumn } from "../views/rulesConfiguration.view";

export class RulesConfiguration {
    constructor() {
        navigateTo(rulesConfiguration);
    }

    add(rule: string): void {
        clickByText(pageTab, customRules);
        shouldBeEnabled(primaryButton, addRule);
        clickByText(primaryButton, addRule);
        shouldBeEnabled(primaryButton, browse);
        importFile(rule);
        shouldBeEnabled(primaryButton, close);
        clickByText(primaryButton, close);
    }

    search(rule: string) {
        navigateTo(rulesConfiguration);
        clickByText(pageTab, customRules);
        cy.wait(10*SEC);
        inputText(customRulesSearch, rule);
        cy.wait(MINUTE/2);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(ruleShortPathColumn + " > span")
            .find("span")
            .first()
            .then(($a) => {
                expect($a.text()).to.eq(rule);
            });
    }

    validateCount(count: number): void {
        cy.wait(MINUTE/2);
        cy.get(tableBody)
            .find(trTag)
            .then((row) => {
                expect(row.length).to.equal(count);
            });
    }

    delete(rule: string, cancel = false): void {
        cy.wait(SEC);
        navigateTo(rulesConfiguration);
        clickByText(pageTab, customRules);
        performRowActionByIcon(rule, kebabMenu);
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

    deleteAllRules() {
        cy.get(ruleShortPathColumn + " > span > span").each(($rule) => {
            this.delete($rule.text());
            cy.wait(20 * SEC);
        });
    }
}
