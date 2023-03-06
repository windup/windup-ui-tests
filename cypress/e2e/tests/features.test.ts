/// <reference types="Cypress" />
/// <reference types='cypress-tags' />

import { onlyOn, skipOn } from "@cypress/skip-test";
import {
    getRandomApplicationData,
    isInstalledOnOCP,
    isMTROnOCP,
    login,
    navigateTo,
    trimAppNames,
} from "../../utils/utils";
import { Projects } from "../models/projects";
import { completed, projects, SEC } from "../types/constants";

describe(["special"], "Features", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("MTA-239: Validate azure-aks target not present in MTR", function () {
        onlyOn(isMTROnOCP());
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        navigateTo(projects);
        project.openCreateWizard();
        project.enterProjectDetails(projectData["name"], projectData["desc"]);
        project.addApplications(projectData["apps"]);
        cy.contains("h4", "Azure", { timeout: 120 * SEC });
        //Checking if the dropdown for multiple azure target exists with default value set as azure-appservice.
        //It should not exist in downstream
        cy.contains("span", "azure-appservice", { timeout: 120 * SEC }).should("not.exist");
    });

    after("Teardown", function () {
        if (!isMTROnOCP()) return;
        login();
        Projects.deleteAllProjects();
    });
});
