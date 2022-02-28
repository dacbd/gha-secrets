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
    const octokit = github.getOctokit(token);


    console.log(context)

    if (!loc) {
      core.warning('location not set, inferring what type of secret from the running environment');
    }
    
    orgKey = await octokit.request('GET /orgs/{org}/actions/secrets/public-key', {
      org: ''
    });
    repoKey = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      owner: 'octocat',
      repo: 'hello-world'
    });
    envKey = await octokit.request('GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key', {
      repository_id: 42,
      environment_name: 'environment_name'
    });

    // org secret
    await octokit.request('PUT /orgs/{org}/actions/secrets/{secret_name}', {
      org: 'org',
      secret_name: 'secret_name',
      visibility: 'visibility'
    });

    // repo secret
    await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: 'octocat',
      repo: 'hello-world',
      secret_name: 'secret_name',
      encrypted_value: 'encrypted_value'
    });

    // environment secret
    await octokit.request('PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}', {
      repository_id: 42,
      environment_name: 'environment_name',
      secret_name: 'secret_name',
      encrypted_value: 'encrypted_value',
      key_id: 'key_id'
    });

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
