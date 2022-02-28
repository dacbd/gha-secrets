# gha-secrets
[![Test Action](https://github.com/dacbd/gha-secrets/actions/workflows/test.yml/badge.svg)](https://github.com/dacbd/gha-secrets/actions/workflows/test.yml) [![CodeQL](https://github.com/dacbd/gha-secrets/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/dacbd/gha-secrets/actions/workflows/codeql-analysis.yml)


Create or update your GitHub Actions secrets.

> :warning: The new Secret value wont change for the workflow using this action or any jobs currently running :warning:

## Options
| option | value | notes |
| ------------ | ------------ | ------------ |
| `token` | GitHub Token w/ correct permissions  | `required`  |
| `location` | Where the secret is `repo`, `org`, `(evnironment name)`  | defaults to `repo`/`repository` |
| `name` | Name of the secret to update | `required` |
| `value` | New value to update with | `required` |
| `visibility` | required for [org secrets](https://docs.github.com/en/rest/reference/actions#create-or-update-an-organization-secret)  | defaults to `selected` |

## Usage
```yml
      - id: generate_secret
        run: Generate my token
      - uses: dacbd/gha-secrets@v1
        with:
          token: ${{ secrets.TOKEN }}
          name: 'GHA_SECRETS_TEST'
          value: ${{ steps.generate_secret.outputs.value }}
```

## References
- https://docs.github.com/en/rest/reference/actions#secrets
- https://github.com/github/tweetsodium

## Similar actions
- https://github.com/hmanzur/actions-set-secret
- https://github.com/jon-grey/github-actions-secrets-creator



## License
MIT
