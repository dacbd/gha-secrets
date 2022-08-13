const core = require('@actions/core');
const github = require('@actions/github');
const sodium = require('tweetsodium');

async function run() {
  try {
    const context = github.context
    const token = core.getInput('token');  // required
    const loc = core.getInput('location'); // optional
    const name = core.getInput('name');    // required
    const value = core.getInput('value');  // required
    const visibility = core.getInput('visibility'); // optional
    const octokit = github.getOctokit(token);
    const [org, repo] = core.getInput('repository').split('/');
    const repository_id = (await octokit.rest.repos.get({
      owner: org, 
      repo: repo
    })).id;
    core.setSecret(value);

    core.debug(`location: ${loc}`);
    core.debug(`name: ${name}`);
    core.debug(`value: ${value}`);
    core.debug(`visibility: ${visibility}`);
    core.debug(`repository_id: ${repository_id}`);
    core.debug(`org: ${org}`);
    core.debug(`repo: ${repo}`);
    // Get key
    core.startGroup('Load Public Key');
    let res;
    switch (loc) {
      case 'repo':
      case 'repository':
        core.debug('loading repo key')
        res = await octokit.rest.actions.getRepoPublicKey({
          owner: org,
          repo: repo
        });
        break;
      case 'org':
      case 'organization ':
        core.debug('loading org key')
        res = await octokit.rest.actions.getOrgPublicKey({
          org: org
        });
        break;
      default:
        core.debug('loading environment key')
        res = await octokit.rest.actions.getEnvironmentPublicKey({
          repository_id: repository_id,
          environment_name: loc
        });
        break;
    }
    core.endGroup();
    
    // Encrypt Secret
    core.startGroup('Encrypt Value')
    const bytes = sodium.seal(Buffer.from(value), Buffer.from(res.data.key, 'base64'));
    const encrypted_value = Buffer.from(bytes).toString('base64');
    core.endGroup();

    // Save Secret
    core.startGroup('Save new Value')
    switch (loc) {
      case 'repo':
      case 'repository':
        core.debug('Saving Secret at repo level');
        await octokit.rest.actions.createOrUpdateRepoSecret({
          key_id: res.data.key_id,
          owner: org,
          repo: repo,
          secret_name: name,
          encrypted_value: encrypted_value
        });
        break;
      case 'org':
      case 'organization ':
        core.debug('Saving Secret at org level');
        await octokit.rest.actions.createOrUpdateOrgSecret({
          key_id: res.data.key_id,
          org: org,
          secret_name: name,
          encrypted_value: encrypted_value,
          visibility: visibility
        });
        break;
      default:
        core.debug('Saving Secret at environment level');
        await octokit.rest.actions.createOrUpdateEnvironmentSecret({
          key_id: res.data.key_id,
          repository_id: repository_id,
          environment_name: loc,
          secret_name: name,
          encrypted_value: encrypted_value,
        });
        break;
    }
    core.endGroup()
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
