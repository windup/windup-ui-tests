import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
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
        analysis.sortReportBy("Name");
        analysis.matchAppsOrder();
        analysis.sortReportBy("Story Points");
        analysis.matchStoryPointsOrder();
    });

    it("Check Report Links", function () {
        let projectData = getRandomApplicationData(this.projectData["Containerization"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        analysis.
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
