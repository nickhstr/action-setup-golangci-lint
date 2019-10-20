# action-setup-golangci-lint
Install [golangci/golangci-lint](https://github.com/golangci/golangci-lint) for workflows.

golangci-lint is downloaded and added to the tools cache for reuse across jobs/steps in a workflow.

## Inputs
Only one input is needed: `version`. This must be a semantic version, matching a released version of golangci-lint.
