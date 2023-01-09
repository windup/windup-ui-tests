import { getRandomApplicationData, login } from "../../utils/utils";
import { Applications } from "../models/applications";
import { Projects } from "../models/projects";
import { appsPath } from "../types/constants";

describe("Applications page", () => {
    beforeEach("Login", function () {
        //Move to Before after adding support for SecureURL.
        login();

        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    it("Add/Remove application to existing project", function () {
        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["BasicApp_eap7"]);
        const project = new Projects(projectData);
        project.create();

        //Adding 2 more applications to that project
        const application = new Applications(projectData["name"]);
        application.addApplication([appsPath + "agent.jar", appsPath + "cadmium-war-0.1.0.war"]);

        //TODO: Validating the app count = 3 for the project
        application.validateAppCount(3);

        //Deleting 1 of the previously added applications
        application.deleteApplication("agent.jar");

        //TODO: Validating the app count = 2 for the project
        application.validateAppCount(2);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
