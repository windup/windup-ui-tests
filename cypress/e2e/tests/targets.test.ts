/// <reference types="Cypress" />
/// <reference types='cypress-tags' />

import { getRandomApplicationData, isInstalledOnOCP, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";
import { skipOn } from "@cypress/skip-test";

describe(["tier1"], "Analysis on different targets", function () {
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

    it("Analysis for target Eap8", function () {
        let projectData = getRandomApplicationData(this.projectData["Eap8"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
        analysis.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target OpenJdk17", function () {
        let projectData = getRandomApplicationData(this.projectData["Openjdk17"]);
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

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
