import { login } from "../../utils/utils";
import { LabelsConfiguration } from "../models/labelsConfiguration";

describe("Labels Configuration", () => {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Create/ Remove Custom Global Label", function () {
        const globalLabels = new LabelsConfiguration();
        let labelsDir = Cypress.env("jenkinsWorkspacePath") + "/cypress/fixtures/xml/";
        globalLabels.add(labelsDir + "customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.delete("customWebLogic.windup.label.xml");
    });

    it("Search Custom Global Label", function () {
        const globalLabels = new LabelsConfiguration();
        let labelsDir = Cypress.env("jenkinsWorkspacePath") + "/cypress/fixtures/xml/";
        globalLabels.add(labelsDir + "customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.search("customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.delete("customWebLogic.windup.label.xml");
    });
});
