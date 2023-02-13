import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { AnalysisConfiguration } from "../models/analysis_configuration";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

describe(["tier2"], "Advanced Options", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Test all switch options", function () {
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();
        const analysisConf = new AnalysisConfiguration(projectData["name"]);
        let newOptions = {
            options: [
                "Export CSV",
                "Disable Tattletale",
                "Class Not Found analysis",
                "Compatible Files report",
                "Exploded app",
                "Keep work dirs",
                "Mavenize",
                "Analyze known libraries",
                "Transaction analysis",
            ],
        };
        analysisConf.modifyAdvancedOptions(newOptions);

        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
