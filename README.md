# Backabo self-service environments

This is a multi-cloud environment service built on top of Pulumi. The frontend is built with SvelteKit, the backend is an express server that uses the Pulumi automation api, and there is av event-service using websockets. The README files in the respective folders give more references.

The service depends on a set of environment variables (containing credentials and configurations for the cloud resource providers) that are assumed to be defined in a file setup.sh, which is not included in this repo.

The service depends on that Pulumi is installed and configured, for testing purposes with a local file state store, no Pulumi subscription is needed.