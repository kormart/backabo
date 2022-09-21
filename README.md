# Backabo self-service environments

This is an experimental project, meant for functional usage validation. There has been very little non-functional testing.

This is a multi-cloud environment service built on top of Pulumi. The frontend is built with SvelteKit, the backend is an Express server that uses the Pulumi automation api, and there is av event-service using websockets. The README files in the respective folders give more references.

The service depends on a set of environment variables (containing credentials and configurations for the cloud resource providers) that are assumed to be defined in a file setup.sh, which is not included in this repo.

The service depends on that Pulumi is installed and configured, for testing purposes with a local file state store, no Pulumi subscription is needed.

## Frontend

The frontend is built with SvelteKit. SvelteKit has its own backend (Backend-for-frontend pattern) that helps with calls to the actual backend in a secure way.

## Backend

The backend is an Express server that serves endpoints for the operations: list, create, delete, which all triggers calls to the Pulumi automation API. The backend also serves the content of the smorgasbord file, which describes the possible resource components. 

## Pulumi

The Pulumi CLI must be installed. 
https://www.pulumi.com/docs/
The Pulumi plugins are determined by the package.json file.