import cypress from "cypress";
import {
    clickByText,
    navigateTo,
    performRowActionByIcon,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
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
    allIncidentsTables,
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
        shouldBeEnabled(primaryButton, runAnalysisButton);
        clickByText(primaryButton, runAnalysisButton);
        cy.wait(10 * SEC);
    }

    //Function to wait for the analysis to complete and then validate the analysis status as expected.
    verifyLatestAnalysisStatus(status: string): void {
        // Verify the latest analysis status
        shouldBeEnabled(primaryButton, runAnalysisButton);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(statusColumn)
            .find("span")
            .first()
            .then(($span) => {
                shouldBeEnabled(primaryButton, "Run analysis");
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

    validateIncidents(appNames: string[], incidents: any): void {
        //This function matches all the incident points one by one as it is expected for each app.
        for (var index = 0; index < appNames.length; index++) {
            let mandatory = incidents[index].mandatory;
            let optional = incidents[index].optional;
            let potential = incidents[index].potential;
            let informational = incidents[index].informational;
            let total = incidents[index].total;

            cy.get(allIncidentsTables).eq(index).as("incidentTable");
            cy.get("@incidentTable")
                .find("tr")
                .each(($row) => {
                    if ($row.children("td.label_").text().includes("Mandatory")) {
                        expect(mandatory).equal(Number($row.children("td.count").text()));
                    }
                    if ($row.children("td.label_").text().includes("Optional")) {
                        expect(optional).equal(Number($row.children("td.count").text()));
                    }
                    if ($row.children("td.label_").text().includes("Potential")) {
                        expect(potential).equal(Number($row.children("td.count").text()));
                    }
                    if ($row.children("td.label_").text().includes("Information")) {
                        expect(informational).equal(Number($row.children("td.count").text()));
                    }
                    if ($row.children("td.label_").text().includes("Total")) {
                        expect(total).equal(Number($row.children("td.count").text()));
                    }
                });
        }
    }
}
