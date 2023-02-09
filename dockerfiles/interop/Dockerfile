FROM cypress/base:latest

# Update container and install unzip
RUN apt -y update && apt install -y unzip

# Create /tmp/windup-ui-tests, copy this repo in to the container and install required Node packages
RUN mkdir /tmp/windup-ui-tests
WORKDIR /tmp/windup-ui-tests
COPY . .
RUN npm install && npm install cypress-mochawesome-reporter

# Unzip all zip files in /tmp/windup-ui-tests/cypress/fixtures/applications
WORKDIR /tmp/windup-ui-tests/cypress/fixtures/applications
RUN unzip '*.zip'

# Set WORKDIR to /tmp/windup-ui-tests
WORKDIR /tmp/windup-ui-tests

# Set required permissions for OpenShift usage
RUN chgrp -R 0 /tmp && \
    chmod -R g=u /tmp

CMD ["/bin/bash"]