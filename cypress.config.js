const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        windupUrl: "localhost:8080",
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
});
