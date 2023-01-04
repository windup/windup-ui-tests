const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: "cypress/e2e/**/*.test.ts",
    },
    env: {
        windupUrl: "localhost:8080",
        jenkinsWorkspacePath: "",
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
        reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
        cypressMochawesomeReporterReporterOptions: {
            reportDir: "cypress/reports",
            charts: true,
            reportPageTitle: "Windup test report",
            embeddedScreenshots: true,
            inlineAssets: true
        },
        mochaJunitReporterReporterOptions: {
            mochaFile: "cypress/reports/junit/results-[hash].xml"
        }
    },
});
