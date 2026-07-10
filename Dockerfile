FROM cypress/included:10.3.0

WORKDIR /cypress
COPY ./cypress .

RUN npm install

LABEL ca.unb.lib.generator="cypress" \
  org.opencontainers.image.title="cypress" \
  org.opencontainers.image.description="docker-cypress is the base cypress image at UNB Libraries." \
  org.opencontainers.image.url="https://github.com/unb-libraries/docker-cypress" \
  org.opencontainers.image.source="https://github.com/unb-libraries/docker-cypress" \
  org.opencontainers.image.version="$VERSION" \
  org.opencontainers.image.revision="$VCS_REF" \
  org.opencontainers.image.created="$BUILD_DATE"
