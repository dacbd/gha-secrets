# gha-secrets
Create or update your GitHub Actions secrets.

> :warning: The new Secret value wont change for the workflow using this action or any jobs currently running

## Options
| option | default value | notes |
| ------------ | ------------ | ------------ |
| `token` | GitHub Token w/ correct permissions  | `required`  |
| `location` | Where the secret is `repo`, `org`, `(evnironment name)`  | defaults to `repo`/`repository` |
| `name` | Name of the secret to update | `required` |
| `value` | New value to update with | `required` |
| `visibility` | required for [org secrets]()  | defaults to `selected` |

## Usage


## References
- https://docs.github.com/en/rest/reference/actions#secrets
- https://github.com/github/tweetsodium

## Simular actions
- https://github.com/hmanzur/actions-set-secret
- https://github.com/jon-grey/github-actions-secrets-creator



## License
MIT
