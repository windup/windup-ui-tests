import { getRandomApplicationData, login } from "../../utils/utils";
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

        //TODO: Open Reports & Validation of story points
    });

    it("Analysis for target Containerization ", function () {
        let projectData = getRandomApplicationData(this.projectData["Containerization"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);

        //TODO: Open Reports & Validation of story points
    });
});
