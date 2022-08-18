# unb-libraries/docker-cypress
A Cypress docker image that provides basic configuration to add Cypress testing to a dockerized project and development workflow.

## Usage
Given a project layout similar to the following:

```
project_root/
├─ src/
├─ tests/
│  ├─ cypress/
│  │  ├─ e2e/
│  │  │  ├─ spec_1.cy.js
│  │  │  ├─ spec_2.cy.js
├─ Dockerfile
├─ docker-compose.yml

```
In a docker-compose project, set the `BASE_URL` environment variable to your app container's address. This will be used as the `baseUrl` in all Cypress tests. Mount cypress specs as a volume.
```
  services:
      app:
        ...
        networks:
          - appnet
  
      cypress:
        image: ghcr.io/unb-libraries/cypress:10.x-1.x
        environment:
          - BASE_URL=http://app
        volumes:
          - ./tests/cypress/e2e:/cypress/e2e
        networks:
          - appnet
  
  networks:
    - appnet
      
```

## Run
Execute tests and display the latest results as follows:
```
docker start <CYPRESS_CONTAINER_NAME> && docker logs -f --since 0s <CYPRESS_CONTAINER_NAME>
```
