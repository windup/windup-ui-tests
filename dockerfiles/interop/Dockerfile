FROM docker.io/cypress/included:12.7.0

# point Cypress at the /tmp/cache no matter what user account is used
# see https://on.cypress.io/caching
ENV CYPRESS_CACHE_FOLDER=/tmp/.cache/Cypress
ENV npm_config_cache=/tmp/.cache/npm

# Must remove the Google Chrome repository because there is a missing GPG key and it causes the build to fail
# Then run "apt update" and instal gnupg to add the missing GPG key for Google Chrome
# Then re-add the Google Chrome repository
# After fixing the GPG issue, we can install unzip (the only reason all of that had to be done...)
RUN echo "" > /etc/apt/sources.list.d/google-chrome.list \
    && apt -y update \
    && apt install -y gnupg \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && apt -y update \
    && apt install -y unzip

# Create /tmp/windup-ui-tests, copy this repo in to the container and install required Node packages
RUN mkdir /tmp/windup-ui-tests
WORKDIR /tmp/windup-ui-tests
COPY . .
RUN npm install && \
    npm install cypress-mochawesome-reporter \
    cypress-tags \
    cypress \
    cypress-multi-reporters

# Unzip all zip files in /tmp/windup-ui-tests/cypress/fixtures/applications
WORKDIR /tmp/windup-ui-tests/cypress/fixtures/applications
RUN unzip '*.zip'

# Set WORKDIR to /tmp/windup-ui-tests
WORKDIR /tmp/windup-ui-tests

# Set required permissions for OpenShift usage
RUN mkdir -p /.config && \
    chgrp -R 0 /.config && \
    chmod -R g=u /.config && \
    chgrp -R 0 /tmp && \
    chmod -R g=u /tmp

CMD ["/bin/bash"]