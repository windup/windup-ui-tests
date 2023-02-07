/// <reference types="Cypress" />
/// <reference types='cypress-tags' />

import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

describe(["tier1"], "Analysis", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it(["interop"], "Analysis for target Jakarta EE 9", function () {
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
    });

    it(["interop"], "Analysis for target Containerization", function () {
        let projectData = getRandomApplicationData(this.projectData["Containerization"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
    });

    it("Analysis for target Quarkus", function () {
        let projectData = getRandomApplicationData(this.projectData["3_SB_Apps"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
        analysis.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target Quarkus + OpenJDK 11", function () {
        let projectData = getRandomApplicationData(this.projectData["3_SB_Apps_2_targets"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
        analysis.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for Complete Duke with SourceMode", function () {
        let projectData = getRandomApplicationData(this.projectData["complete-duke_SM"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
        analysis.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for JEE Example app", function () {
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
        analysis.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
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
