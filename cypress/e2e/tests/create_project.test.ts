import { login } from "../../utils/utils";
import { Projects } from "../models/projects";

describe("Project page", () => {
    before("Login", function () {
        login();

        cy.fixture("data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    it("Create a project", function () {
        const project = new Projects(this.projectData["app1"]);
        project.create();
    });
});
