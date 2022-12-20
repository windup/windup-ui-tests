import { getRandomApplicationData, login } from "../../utils/utils";
import { Projects } from "../models/projects";

describe("Project page", () => {
    beforeEach("Login", function () {
        login();

        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    // it("Create a project", function () {
    //     const project = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
    //     project.create();

    //     //TODO: Add validation to check if project is created successfully

    // });

    it("Remove a project", function () {
        const project = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
        project.create();

        //TODO: Add validation to check if project is created successfully

        project.deleteProject(project.name);
    });

    // it("Edit a project", function () {
    //     const project = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
    //     project.create();

    //     //TODO: Add validation to check if project is created successfully

    // });
});
