import { login } from "../../utils/utils";
import { Projects } from "../models/projects/projects";
import {
    allowNetworkAccess,
    analyzeKnownLibraries,
    azureAks,
    classNotFoundAnalysis,
    compatibleFilesReport,
    containerization,
    disableTattletale,
    eap7,
    eap8,
    explodedApp,
    exportCsv,
    keepWorkDirs,
    linux,
    mavenize,
    quarkus,
    skipReports,
    sourceMode,
    transactionAnalysis,
} from "../types/constants";

describe("Project page", () => {
    before("Login", function () {
        login();
    });

    it("Create a project", function () {
        let advancedOptionsData = {
            applicationName: "custom_name",
            options: [exportCsv, disableTattletale],
        };

        let projectDetails = {
            name: "Test",
            desc: "This is the project description",
            apps: [
                "cypress/e2e/fixtures/acmeair-webapp-1.0-SNAPSHOT.war",
                "cypress/e2e/fixtures/agent.jar",
            ],
            targets: [eap7, quarkus, eap8, azureAks],
            advancedOptions: advancedOptionsData,
        };

        const project = new Projects(projectDetails);

        project.create();
    });
});
