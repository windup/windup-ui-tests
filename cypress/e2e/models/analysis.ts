import cypress from "cypress";
import { clickByText, navigateTo, performRowActionByIcon, selectProject } from "../../utils/utils";
import {
    analysisResults,
    MINUTE,
    pending,
    runAnalysisButton,
    running,
    SEC,
} from "../types/constants";
import {
    actionsColumn,
    fileName,
    reportLink,
    reportStoryPoints,
    statusColumn,
} from "../views/analysis.view";
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
            .first()
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

    //Function to open reports for an analysis
    openReport(): void {
        cy.wait(SEC);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(actionsColumn)
            .get(reportLink)
            .then(($report) => {
                $report.attr("target", "_self");
            })
            .click();

        cy.wait(SEC);
        //TODO: Add validation that report has opened
    }

    validateStoryPoints(appNames: string[], points: number[]): void {
        for (var index = 0; index < appNames.length; index++) {
            cy.get(fileName).should("contain", appNames[index]);
            cy.get(reportStoryPoints).should("contain", points[index]);
        }
    }
}
