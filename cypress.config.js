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
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
});
