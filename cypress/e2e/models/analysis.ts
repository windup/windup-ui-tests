import { clickByText, navigateTo, performRowActionByIcon, selectProject } from "../../utils/utils";
import { analysisResults, MINUTE, pending, runAnalysisButton, running } from "../types/constants";
import { statusColumn } from "../views/analysis.view";
import { primaryButton } from "../views/common.view";

export class Analysis {
    projectName: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        navigateTo(analysisResults);
        selectProject(this.projectName);
    }

    //Function to run the analysis for an existing project
    runAnalysis(): void {
        clickByText(primaryButton, runAnalysisButton);
    }

    //Function to wait for the analysis to complete and then validate the analysis status as expected.
    verifyLatestAnalysisStatus(status: string): void {
        // Verify the latest analysis status
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(statusColumn)
            .find("span")
            .then(($span) => {
                if (
                    $span.text().toString().includes(running) ||
                    $span.text().toString().includes(pending)
                ) {
                    cy.wait(MINUTE / 2);
                    this.verifyLatestAnalysisStatus(status);
                } else {
                    expect($span.text().toString().includes(status)).to.eq(true);
                }
            });
    }

    //TODO: Function to validate app count of an analysis

    //TODO: Function to delete an analysis

    //TODO: Function to open reports for an analysis
}
