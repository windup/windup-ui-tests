import { login } from "../../utils/utils";
import { Applications } from "../models/applications";

describe("Applications page", () => {
    beforeEach("Login", function () {
        login();

        cy.fixture("data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    // it("Add application to existing project", function () {
    //     const application = new Applications("aaaa");
    //     application.addApplication([
    //         "cypress/fixtures/agent.jar",
    //         "cypress/fixtures/cadmium-war-0.1.0.war",
    //     ]);
    // });

    // it("Delete application from existing project", function () {
    //     const application = new Applications("aaaa");
    //     application.deleteApplication("cadmium-war-0.1.0.war");
    //     application.deleteApplication("agent.jar");
    // });
});
