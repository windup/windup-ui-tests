import { getRandomApplicationData, login } from "../../utils/utils";
import { Applications } from "../models/applications";
import { Projects } from "../models/projects";
import { appsPath } from "../types/constants";

describe(["tier1"], "Applications page", () => {
    beforeEach("Login", function () {
        //Move to Before after adding support for SecureURL.
        login();

        cy.fixture("json/data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    it("Sort Applications", function () {
        let projectData = getRandomApplicationData(this.projectData["JakartaEE9"]);
        const project = new Projects(projectData);
        project.create();
        const application = new Applications(projectData["name"]);

        //Sort in Ascending order BY APPLICATION name and Validate Order
        application.sortAppsBy("Application");
        let appsAscByName = [
            "acmeair-webapp-1.0-SNAPSHOT.war",
            "customers-tomcat-0.0.1-SNAPSHOT.war",
            "spring-petclinic-2.4.0.BUILD-SNAPSHOT.jar",
        ];
        application.matchAppsOrder(appsAscByName);

        //Sort in DESCENDING order BY APPLICATION and Validate Order
        application.sortAppsBy("Application");
        let appsDescByName = [
            "spring-petclinic-2.4.0.BUILD-SNAPSHOT.jar",
            "customers-tomcat-0.0.1-SNAPSHOT.war",
            "acmeair-webapp-1.0-SNAPSHOT.war",
        ];
        application.matchAppsOrder(appsDescByName);

        //Sort in Ascending order BY DATE ADDED and Validate Order
        application.sortAppsBy("Date added");
        let appsAscByDate = [
            "acmeair-webapp-1.0-SNAPSHOT.war",
            "customers-tomcat-0.0.1-SNAPSHOT.war",
            "spring-petclinic-2.4.0.BUILD-SNAPSHOT.jar",
        ];
        application.matchAppsOrder(appsAscByDate);

        //Sort in DESCENDING order BY DATE ADDED and Validate Order
        application.sortAppsBy("Date added");
        let appsDescByDate = [
            "spring-petclinic-2.4.0.BUILD-SNAPSHOT.jar",
            "customers-tomcat-0.0.1-SNAPSHOT.war",
            "acmeair-webapp-1.0-SNAPSHOT.war",
        ];
        application.matchAppsOrder(appsDescByDate);
    });

    it(["interop"], "Add/Remove application to existing project", function () {
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
        application.delete("agent.jar");

        //TODO: Validating the app count = 2 for the project
        application.validateAppCount(2);

        //Cancel Delete
        application.delete("cadmium-war-0.1.0.war", true);
    });

    it("Search application", function () {
        //Creating a basic project with single application
        let projectData = getRandomApplicationData(this.projectData["BasicApp_eap7"]);
        const project = new Projects(projectData);
        project.create();

        //Adding 2 more applications to that project
        const application = new Applications(projectData["name"]);

        application.search("acmeair-webapp-1.0-SNAPSHOT.war");
        //Validating that after searching the app, only 1 app is visible in UI
        application.validateAppCount(1);
    });

    after("Teardown", function () {
        login();
        Projects.deleteAllProjects();
    });
});
