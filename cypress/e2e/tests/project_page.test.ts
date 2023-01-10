import { getRandomApplicationData, login } from "../../utils/utils";
import { Projects } from "../models/projects";

describe("Project page", () => {
    beforeEach("Login", function () {
        login();

        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    it("Sort projects", function () {
        const project1 = new Projects(
            getRandomApplicationData(this.projectData["Containerization"])
        );
        project1.create();

        const project2 = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
        project2.create();

        const project3 = new Projects(getRandomApplicationData(this.projectData["JakartaEE9"]));
        project3.create();

        //Sort in Ascending order BY NAME and Validate Order
        Projects.sortProjectsBy("Name");
        let projectsAscByName = [project2.name, project1.name, project3.name];
        Projects.matchProjectOrder(projectsAscByName);

        //Sort in Descending order BY NAME and Validate Order
        Projects.sortProjectsBy("Name");
        let projectDescByName = [project3.name, project1.name, project2.name];
        Projects.matchProjectOrder(projectDescByName);

        //Sort in Ascending order BY APPLICATIONS and Validate Order
        Projects.sortProjectsBy("Applications");
        let projectAscByApps = [project1.name, project2.name, project3.name];
        Projects.matchProjectOrder(projectAscByApps);

        //Sort in Descending order BY APPLICATIONS and Validate Order
        Projects.sortProjectsBy("Applications");
        let projectDescByApps = [project3.name, project2.name, project1.name];
        Projects.matchProjectOrder(projectDescByApps);

        //Sort in Ascending order BY STATUS and Validate Order
        Projects.sortProjectsBy("Status");
        let projectAscByStatus = [project1.name, project2.name, project3.name];
        Projects.matchProjectOrder(projectAscByStatus);

        //Sort in Descending order BY STATUS and Validate Order
        Projects.sortProjectsBy("Status");
        let projectDescByStatus = [project3.name, project2.name, project1.name];
        Projects.matchProjectOrder(projectDescByStatus);
    });

    it("CRUD project", function () {
        const project = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
        project.create();
        let newName = "BasicApp_Edited";
        let newDesc = "This description is edited";
        project.editProject(newName, newDesc);
        project.validateProject(newName, newDesc, "1");
        Projects.delete(newName);
    });

    it("Search a project", function () {
        const project = new Projects(getRandomApplicationData(this.projectData["BasicApp_eap7"]));
        project.create();
        Projects.searchProject(project.name);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
