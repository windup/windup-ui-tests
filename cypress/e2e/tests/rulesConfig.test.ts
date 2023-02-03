import { login } from "../../utils/utils";
import { RulesConfiguration } from "../models/rulesConfiguration";


describe(["tier2"], "Rules Configuration", () => {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Create/ Remove Custom Global Rule", function () {
        const globalRules = new RulesConfiguration();
        let rulesDir = Cypress.env("jenkinsWorkspacePath") + "/cypress/fixtures/xml/";
        globalRules.add(rulesDir + "custom.Test1rules.rhamt.xml");
        globalRules.add(rulesDir + "empty_rule_file.xml");
        globalRules.validateCount(2);
        globalRules.delete("custom.Test1rules.rhamt.xml");
        globalRules.validateCount(1);
        globalRules.delete("empty_rule_file.xml");
    });

    it("Search Custom Global Rule", function () {
        const globalRules = new RulesConfiguration();
        let rulesDir = Cypress.env("jenkinsWorkspacePath") + "/cypress/fixtures/xml/";
        globalRules.add(rulesDir + "custom.Test1rules.rhamt.xml");
        globalRules.add(rulesDir + "empty_rule_file.xml");
        globalRules.validateCount(2);
        globalRules.search("empty_rule_file.xml");
        globalRules.validateCount(1);
        globalRules.delete("empty_rule_file.xml");
    });
});
