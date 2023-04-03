import { getRandomApplicationData, login, trimAppNames } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { LegacyReport } from "../models/legacyReports";
import { PF4Reports } from "../models/pf4Reports";
import { Projects } from "../models/projects";
import { completed } from "../types/constants";

describe(["tier2"], "Report Cases", function () {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it(["bug"], "WINDUP-3722: Links to search.maven.org are broken", function () {
        let projectData = getRandomApplicationData(this.projectData["Openjdk17"]);
        const project = new Projects(projectData);
        project.create();
        const analysis = new Analysis("Jakarta_nihil68");
        analysis.runAnalysis();
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openReport();
        const pf4Report = new PF4Reports();
        pf4Report.validateDependency("customers-tomcat-0.0.1-SNAPSHOT.war", "antlr-2.7.7.jar");
        //pf4Report.validateDependency("camunda-bpm-spring-boot-starter-example-war-2.0.0.war", "activation-1.1.jar", "activation-1.1");
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
