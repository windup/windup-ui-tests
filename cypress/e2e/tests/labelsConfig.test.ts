import { getRandomApplicationData, login } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { LabelsConfiguration } from "../models/labelsConfiguration";
import { Projects } from "../models/projects";

let labelsDir = "cypress/fixtures/xml/";

describe(["tier2"], "Labels Configuration", () => {
    beforeEach("Login", function () {
        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });

        login();
    });

    it("Create/ Remove Custom Global Label", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.add(labelsDir + "customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.delete("customWebLogic.windup.label.xml");
    });

    it("Search Custom Global Label", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.add(labelsDir + "customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.search("customWebLogic.windup.label.xml");
        globalLabels.validateCount(1);
        globalLabels.delete("customWebLogic.windup.label.xml");
    });

    it("Invalid label file", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.add(labelsDir + "custom.Test1rules.rhamt.xml");
        globalLabels.validateLabels(0);
        globalLabels.delete("custom.Test1rules.rhamt.xml");
    });

    it("Total global system labels", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.validateSysLabelCount(2);
    });

    it("Search global system labels", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.searchSysLabels("core_labels");
    });

    it("Test analysis with global custom label", function () {
        const globalLabels = new LabelsConfiguration();
        globalLabels.add(labelsDir + "customWebLogic.windup.label.xml");

        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["jee-example-app"]);
        const project = new Projects(projectData);
        project.create();

        //Run analysis
        const analysis = new Analysis(projectData["name"]);
        analysis.runAnalysis();
        analysis.openAnalysisDetails();
        analysis.validateAnalysisLabels("customWebLogic.windup.label.xml");
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
