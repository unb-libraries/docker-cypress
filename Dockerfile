FROM cypress/included:10.3.0

WORKDIR /cypress
COPY ./cypress .

RUN npm install

LABEL ca.unb.lib.generator="cypress" \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.description="docker-cypress is the base cypress image at UNB Libraries." \
  org.label-schema.name="cypress" \
  org.label-schema.url="https://github.com/unb-libraries/docker-cypress" \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/unb-libraries/docker-cypress" \
  org.label-schema.version=$VERSION \
  org.opencontainers.image.source="https://github.com/unb-libraries/docker-cypress"
