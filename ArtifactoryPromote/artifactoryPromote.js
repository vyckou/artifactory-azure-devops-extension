
const tl = require('vsts-task-lib/task');
const utils = require('jfrog-utils');

const cliPromoteCommand = "rt bpr";

function RunTaskCbk(cliPath) {
    let buildDir = tl.getVariable('Agent.BuildDirectory');
    let buildDefinition = tl.getVariable('BUILD.DEFINITIONNAME');
    let buildNumber = tl.getVariable('BUILD_BUILDNUMBER');

    // Get input parameters
    let artifactoryService = tl.getInput("artifactoryService", false);
    let artifactoryUrl = tl.getEndpointUrl(artifactoryService, false);
    let targetRepo = tl.getInput("targetRepo", true);

    let cliCommand = utils.cliJoin(cliPath, cliPromoteCommand, utils.quote(buildDefinition), utils.quote(buildNumber), utils.quote(targetRepo), "--url=" + utils.quote(artifactoryUrl));

    cliCommand = utils.addArtifactoryCredentials(cliCommand, artifactoryService);
    cliCommand = utils.addStringParam(cliCommand, "status", "status");
    cliCommand = utils.addStringParam(cliCommand, "comment", "comment");
    cliCommand = utils.addStringParam(cliCommand, "sourceRepo", "source-repo");
    cliCommand = utils.addBoolParam(cliCommand, "includeDependencies", "include-dependencies");
    cliCommand = utils.addBoolParam(cliCommand, "copy", "copy");
    cliCommand = utils.addBoolParam(cliCommand, "dryRun", "dry-run");

    utils.executeCliCommand(cliCommand, buildDir);
    tl.setResult(tl.TaskResult.Succeeded, "Build Succeeded.");
}

utils.executeCliTask(RunTaskCbk);