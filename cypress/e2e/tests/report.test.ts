import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { LegacyReport } from "../models/legacyReports";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

describe(["tier2"], "Report Cases", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Sort Report with Name/Story Points", function () {
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const legacyReport = new LegacyReport();
        legacyReport.sortReportBy("Name");
        legacyReport.matchAppsOrder();
        legacyReport.sortReportBy("Story Points");
        legacyReport.matchStoryPointsOrder();
    });

    it("Validate Technology Tags for target Jakarta", function () {
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const legacyReport = new LegacyReport();
        legacyReport.validateTechTags(trimAppNames(projectData["apps"]), projectData["tags"]);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
