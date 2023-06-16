import {
    click,
    clickByText,
    clickPf4ReportTab,
    clickReportTab,
    inputText,
    navigateTo,
} from "../../utils/utils";
import { SEC, allApps, dependencies, technologies } from "../types/constants";
import { allIncidentsTables, fileName, reportStoryPoints } from "../views/analysis.view";
import {
    applications,
    dependencySearchInput,
    incidentCounts,
    incidentLabels,
    incidentsLink,
    reportTableFilterButtons,
    storyPoints,
} from "../views/pf4reports.view";

export class PF4Reports {
    validateStoryPoints(appNames: string[], points: number[]): void {
        for (var index = 0; index < appNames.length; index++) {
            cy.get(applications).should("contain", appNames[index]);
            cy.get(storyPoints).should("contain", points[index]);
        }
    }

    validateTechTags(appNames: string[], tags): void {
        for (var index = 0; index < appNames.length; index++) {
            clickByText(applications + " > a", appNames[index]);
            clickPf4ReportTab(technologies);
            for (var tagIndex = 0; tagIndex < tags[index].length; tagIndex++) {
                cy.get("div[class='pf-c-card__title']").should("contain", tags[index][tagIndex][0]);
                cy.get("div[class='pf-c-card__body']").should("contain", tags[index][tagIndex][1]);
            }
            navigateTo("Applications");
        }
    }

    matchAppsOrder(appNames: string[]): void {
        let index = 0;
        for (index = 0; index < appNames.length; index++) {
            cy.get(applications + " > a")
                .eq(index + 1)
                .should("have.text", appNames[index]);
        }
    }

    matchStoryPointsOrder(points: number[]): void {
        let index = 0;
        for (index = 0; index < points.length; index++) {
            cy.get(storyPoints)
                .eq(index + 1)
                .should("have.text", String(points[index]));
        }
    }

    sortReportBy(attribute: string) {
        cy.wait(10 * SEC);
        clickByText(reportTableFilterButtons, attribute);
        cy.wait(10 * SEC);
    }

    validateIncidents(appNames: string[], incidents: any): void {
        //This function matches all the incident points one by one as it is expected for each app.
        for (var index = 0; index < appNames.length; index++) {
            let mandatory = incidents[index].mandatory;
            let optional = incidents[index].optional;
            let potential = incidents[index].potential;
            let informational = incidents[index].informational;
            let total = incidents[index].total;

            cy.get(incidentsLink)
                .eq(index + 1)
                .click();

            if (mandatory) {
                cy.get(incidentLabels).should("contain", "Migration mandatory");
                cy.get(incidentCounts).should("contain", mandatory);
            }

            if (optional) {
                cy.get(incidentLabels).should("contain", "Migration optional");
                cy.get(incidentCounts).should("contain", optional);
            }

            if (potential) {
                cy.get(incidentLabels).should("contain", "Migration potential");
                cy.get(incidentCounts).should("contain", potential);
            }

            if (informational) {
                cy.get(incidentLabels).should("contain", "Information");
                cy.get(incidentCounts).should("contain", informational);
            }

            cy.get(incidentsLink)
                .eq(index + 1)
                .click();
        }
    }

    validateDependency(appName: string, dependencyFile: string) : void {
        clickByText(applications + " > a", appName);
        clickPf4ReportTab(dependencies);
        cy.wait(10*SEC);
        inputText(dependencySearchInput, dependencyFile);
        click("tr > td > button");
        cy.get("div.pf-c-description-list__text > a").then(($maven) => {
            $maven.attr("target", "_self");
        }).click({force:true});
    }
}
