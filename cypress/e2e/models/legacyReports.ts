import { click, clickByText, clickReportTab } from "../../utils/utils";
import { SEC, allApps, technologies } from "../types/constants";
import { allIncidentsTables, fileName, reportStoryPoints } from "../views/analysis.view";

export class LegacyReport {
    validateStoryPoints(appNames: string[], points: number[]): void {
        for (var index = 0; index < appNames.length; index++) {
            cy.get(fileName).should("contain", appNames[index]);
            cy.get(reportStoryPoints).should("contain", points[index]);
        }
    }

    validateTechTags(appNames: string[], tags): void {
        for (var index = 0; index < appNames.length; index++) {
            clickByText("div[class='fileName'] > a", appNames[index]);
            clickReportTab(technologies);
            for (var tagIndex = 0; tagIndex < tags[index].length; tagIndex++) {
                cy.get("div[class='content'] > h4").should("contain", tags[index][tagIndex][0]);
                cy.get("div[class='content'] > ul > li").should(
                    "contain",
                    tags[index][tagIndex][1]
                );
            }
            clickReportTab(allApps);
        }
    }

    matchAppsOrder(): void {
        cy.get("div[class='fileName'] > a").then(($elements) => {
            const apps = Array.from($elements, (element) => element.innerText);
            expect(apps).to.deep.eq(apps.sort());
        });
    }

    matchStoryPointsOrder(): void {
        cy.get("span[class='points']").then(($elements) => {
            const points = Array.from($elements, (element) => element.innerText);
            expect(points).to.deep.eq(points.sort());
        });
    }

    sortReportBy(attribute: string) {
        cy.wait(10 * SEC);
        click("span[id='sort-by']");
        cy.wait(10 * SEC);
        clickByText("a", attribute);
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
