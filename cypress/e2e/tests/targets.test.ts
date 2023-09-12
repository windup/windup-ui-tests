/// <reference types="Cypress" />
/// <reference types='cypress-tags' />

import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { LegacyReport } from "../models/legacyReports";
import { PF4Reports } from "../models/pf4Reports";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

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
        const legacyReport = new LegacyReport();
        legacyReport.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
    });

    it(["interop"], "Analysis for target Containerization", function () {
        let projectData = getRandomApplicationData(this.projectData["Containerization"]);
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
    });

    it("Analysis for target Quarkus", function () {
        let projectData = getRandomApplicationData(this.projectData["3_SB_Apps"]);
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

    it("Analysis for target Quarkus + OpenJDK 11", function () {
        let projectData = getRandomApplicationData(this.projectData["3_SB_Apps_2_targets"]);
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

    it("Analysis for target Eap8", function () {
        let projectData = getRandomApplicationData(this.projectData["Eap8"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target OpenJdk17", function () {
        let projectData = getRandomApplicationData(this.projectData["Openjdk17"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for JEE Example app", function () {
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target Openjdk21", function () {
        let projectData = getRandomApplicationData(this.projectData["Openjdk21"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target camel4", function () {
        let projectData = getRandomApplicationData(this.projectData["Camel4"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    it("Analysis for target jws6", function () {
        let projectData = getRandomApplicationData(this.projectData["JWS6"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4reports = new PF4Reports();
        pf4reports.validateStoryPoints(
            trimAppNames(projectData["apps"]),
            projectData["storyPoints"]
        );
        pf4reports.validateIncidents(trimAppNames(projectData["apps"]), projectData["incidents"]);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
