import {
    click,
    clickByText,
    clickReportTab,
    inputText,
    navigateTo,
    performRowActionByIcon,
    selectProject,
    shouldBeEnabled,
} from "../../utils/utils";
import {
    allApps,
    analysisResults,
    cancelButton,
    customLabels,
    customRules,
    deleteButton,
    MINUTE,
    pending,
    runAnalysisButton,
    running,
    SEC,
    technologies,
} from "../types/constants";
import {
    actionsColumn,
    allIncidentsTables,
    analysisIdColumn,
    analysisSearchInput,
    analysisTableFilterButtons,
    fileName,
    reportLink,
    reportStoryPoints,
    statusColumn,
} from "../views/analysis.view";
import {
    dangerButton,
    kebabMenu,
    linkButton,
    primaryButton,
    tableBody,
    trTag,
} from "../views/common.view";

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
        cy.wait(20 * SEC);
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

    searchLatest(): void {
        cy.wait(SEC);
        navigateTo(analysisResults);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(analysisIdColumn)
            .find("a")
            .first()
            .then(($a) => {
                inputText(analysisSearchInput, $a.text());
            });
    }

    search(searchTerm: string): void {
        // Function to Search an analysis by id
        cy.wait(SEC);
        navigateTo(analysisResults);
        inputText(analysisSearchInput, searchTerm);
        cy.wait(SEC);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .find(analysisIdColumn)
            .find("a")
            .first()
            .then(($a) => {
                expect($a.text()).to.include(searchTerm);
            });
    }

    sortAnalysisBy(buttonText: string): void {
        cy.wait(SEC);
        clickByText(analysisTableFilterButtons, buttonText);
        cy.wait(SEC);
    }

    validateAnalysisOrder() {
        cy.get(analysisIdColumn + " > a").then(($elements) => {
            const texts = Array.from($elements, (element) => element.innerText);
            expect(texts).to.deep.eq(texts.sort());
        });
    }

    deleteLatest(cancel = false): void {
        cy.wait(SEC);

        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow").find(actionsColumn).get(linkButton).first().click();

        if (cancel) {
            clickByText(linkButton, cancelButton);
            cy.wait(10 * SEC);
            cy.contains("h1", analysisResults, { timeout: 120 * SEC });
        } else {
            clickByText(dangerButton, deleteButton);
        }
    }

    validateAnalysisCount(count: number): void {
        cy.get(tableBody)
            .find(trTag)
            .then((row) => {
                expect(row.length).to.equal(count);
            });
    }

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

    openAnalysisDetails(): void {
        cy.wait(SEC);
        cy.get("table > tbody > tr").eq(0).as("firstRow");
        cy.get("@firstRow")
            .get(analysisIdColumn + " > a")
            .click();
        cy.wait(10 * SEC);
    }

    validateAnalysisLabels(label: string): void {
        cy.wait(10 * SEC);
        cy.contains(".pf-c-card__title", customLabels).parent().find("button").click();
        cy.contains("ul> li", label, { timeout: MINUTE });
    }

    validateAnalysisRules(rule: string): void {
        cy.wait(10 * SEC);
        cy.contains(".pf-c-card__title", customRules).parent().find("button").click();
        cy.contains("ul> li", rule, { timeout: MINUTE });
    }
}
