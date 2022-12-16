import { login } from "../../utils/utils";
import { Analysis } from "../models/analysis";
import { completed } from "../types/constants";

describe("Analysis page", () => {
    beforeEach("Login", function () {
        login();

        cy.fixture("data").then(function (projectData) {
            this.projectData = projectData;
        });
    });

    // it("Run analysis to existing project", function () {
    //     const analysis = new Analysis("aaaa");

    //     analysis.runAnalysis();
    //     analysis.verifyLatestAnalysisStatus(completed);
    // });
});
