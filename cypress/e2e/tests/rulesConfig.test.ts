import { getRandomApplicationData, login } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { AnalysisConfiguration } from "../models/analysis_configuration";
import { Projects } from "../models/projects";
import { RulesConfiguration } from "../models/rulesConfiguration";
import { completed } from "../types/constants";

let rulesDir = "cypress/fixtures/xml/";

describe(["tier2"], "Rules Configuration", () => {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Total System Global Rules", function () {
        const globalRules = new RulesConfiguration();
        globalRules.showAllRules();
    });

    it("Create/ Remove Custom Global Rule", function () {
        const globalRules = new RulesConfiguration();

        globalRules.add(rulesDir + "custom.Test1rules.rhamt.xml");
        globalRules.add(rulesDir + "empty_rule_file.xml");
        globalRules.validateCount(2);
        globalRules.delete("custom.Test1rules.rhamt.xml");
        globalRules.validateCount(1);
        globalRules.delete("empty_rule_file.xml");
    });

    it("Search Custom Global Rule", function () {
        const globalRules = new RulesConfiguration();
        globalRules.add(rulesDir + "custom.Test1rules.rhamt.xml");
        globalRules.add(rulesDir + "empty_rule_file.xml");
        globalRules.validateCount(2);
        globalRules.search("empty_rule_file.xml");
        globalRules.validateCount(1);
        globalRules.delete("empty_rule_file.xml");
        globalRules.delete("custom.Test1rules.rhamt.xml");
    });

    it("Invalid rule file", function () {
        const globalRules = new RulesConfiguration();
        globalRules.add(rulesDir + "empty_rule_file.xml");
        globalRules.validateRules(0);
        globalRules.delete("empty_rule_file.xml");
    });

    it("Test analysis with global custom rule", function () {
        const globalRules = new RulesConfiguration();
        globalRules.add(rulesDir + "custom.Test1rules.rhamt.xml");

        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();

        //Run analysis
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.openAnalysisDetails();
        analysis.validateAnalysisRules("custom.Test1rules.rhamt.xml");
        globalRules.delete("custom.Test1rules.rhamt.xml");
    });

    it(["bug"], "Bug WINDUP-3322: Add custom rule and Use 'Run analysis' button", function () {
        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();

        const analysisConf = new AnalysisConfiguration(projectData["name"]);
        analysisConf.addNewRule(rulesDir + "custom.Test1rules.rhamt.xml");
        analysisConf.runAnalysis(); // New "Run analysis" button introduced

        const analysis = new Analysis(projectData["name"]);
        analysis.verifyLatestAnalysisStatus(completed);
        analysis.openAnalysisDetails();
        analysis.validateAnalysisRules("custom.Test1rules.rhamt.xml");
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
