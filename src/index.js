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
    
    console.log(context)
    console.log(process.env)
    console.log(github)

    const octokit = github.getOctokit(token);

    const repository_id = context.payload.repository.id
    const [org, repo] = context.payload.repository.full_name.split('/');

    if (!loc) {
      core.info('location not set, inferring what type of secret from the running environment');
    }
    
    // Get key
    let res;
    switch (loc) {
      case 'repo':
      case 'repository':
        res = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
          owner: org,
          repo: repo
        });
        break;
      case 'org':
      case 'organization ':
        res = await octokit.request('GET /orgs/{org}/actions/secrets/public-key', {
          org: org
        });
        break;
      default:
        res = await octokit.request('GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key', {
          repository_id: repository_id,
          environment_name: loc
        });
        break;
    }
    
    // Encrypt Secret
    const bytes = sodium.seal(Buffer.from(value), Buffer.from(res.key, 'base64'));
    const encrypted_value = Buffer.from(bytes).toString('base64');

    // Save Secret
    switch (loc) {
      case 'repo':
      case 'repository':
        await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
          key_id: res.key_id,
          owner: org,
          repo: repo,
          secret_name: name,
          encrypted_value: encrypted_value
        });
        break;
      case 'org':
      case 'organization ':
        await octokit.request('PUT /orgs/{org}/actions/secrets/{secret_name}', {
          key_id: res.key_id,
          org: org,
          secret_name: name,
          encrypted_value: encrypted_value,
          visibility: 'visibility'
        });
        break;
      default:
        await octokit.request('PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}', {
          key_id: res.key_id,
          repository_id: repository_id,
          environment_name: loc,
          secret_name: name,
          encrypted_value: encrypted_value,
        });
        break;
    }
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
