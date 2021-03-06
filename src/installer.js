const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

const toolName = 'golangci-lint';

// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

if (!tempDirectory) {
  tempDirectory = path.join('/home', 'actions', 'temp');
}

/**
 * @param {string} version  x.x.x golangci-lint version
 */
async function installer(version) {
  // check for cached installation
  let toolPath = tc.find(toolName, version);

  if (!toolPath) {
    toolPath = await installGolangciLint(version);
    core.debug(`${toolName} is cached under ${toolPath}`);
  }

  // Add golangci-lint dir to bin
  core.addPath(toolPath);
}

/**
 * @param {string} version
 * @returns {Promise<string>}
 */
async function installGolangciLint(version) {
  // Download golangci-lint
  const downloadUrl = `https://github.com/golangci/golangci-lint/releases/download/v${version}/golangci-lint-${version}-linux-amd64.tar.gz`;
  let downloadPath = '';

  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (err) {
    core.debug(err);

    throw new Error(`failed to download ${toolName} v${version}: ${err.message}`);
  }

  // Extract tar
  const extractPath = await tc.extractTar(downloadPath);

  // Cache golangci-lint dir
  return await tc.cacheDir(extractPath, toolName, version);
}

module.exports = installer;
