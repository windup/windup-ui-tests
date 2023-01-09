import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

describe("Analysis", () => {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Analysis for target Jakarta EE 9", function () {
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.validateStoryPoints(trimAppNames(projectData["apps"]), projectData["storyPoints"]);
    });

    it("Analysis for target Containerization", function () {
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

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
