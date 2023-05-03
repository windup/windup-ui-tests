/// <reference types="Cypress" />
/// <reference types='cypress-tags' />

import { getRandomApplicationData, isInstalledOnOCP, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { LegacyReport } from "../models/legacyReports";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";
import { skipOn } from "@cypress/skip-test";

describe(["tier1"], "Standard Analysis Tests", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });
    it("Analysis for Complete Duke with SourceMode", function () {
        skipOn(isInstalledOnOCP());
        let projectData = getRandomApplicationData(this.projectData["complete-duke_SM"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const legacyReport = new LegacyReport();
        legacyReport.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        legacyReport.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Sort/Search Analysis", function () {
        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();

        //Run analysis twice
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.runAnalysis();

        analysis.sortAnalysisBy("Analysis");
        analysis.validateAnalysisOrder();

        analysis.searchLatest();
        //Validating that after searching the app, only 1 app is visible in UI
        analysis.validateAnalysisCount(1);
    });

    it("Remove analysis", function () {
        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();

        //Run analysis twice
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.runAnalysis();

        analysis.deleteLatest();
        //Validating that after deleting the analysis, only 1 analysis is visible in UI
        analysis.validateAnalysisCount(1);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
