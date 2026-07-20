## Neon + GitHub Actions setup

### Status
| Item | Status |
|------|--------|
| `NEON_PROJECT_ID` (Actions **variable**) | ✅ Set (`odd-boat-86392327`) |
| `NEON_API_KEY` (Actions **secret**) | ⏳ Needs Neon Console key |

### Important: ignore `neonctl` / `oauth2.neon.tech` errors

The Neon CLI OAuth client currently fails with:

`invalid_client` — “The requested OAuth 2.0 Client does not exist.”

That is a **Neon CLI OAuth bug**, not a problem with your account. Do **not** use that auth URL.

### Create `NEON_API_KEY` (working path)

1. Open Neon via Vercel SSO (this works in the browser):
   https://vercel.com/api/marketplace/sso?teamId=team_gjkJCcQphNpWghsXuazthyl1&integrationConfigurationId=icfg_ftuxOhzYAV3O3bhlxzfMkd8X&resource_id=odd-boat-86392327
2. In Neon Console go to **Account settings → API keys**
3. **Create new API key** (name it `github-actions`)
4. Copy the key and either:
   - Paste it back in chat so it can be set as `NEON_API_KEY`, or
   - Add it yourself at  
     https://github.com/Zeordi/tutor-be-betea/settings/secrets/actions/new  
     Name: `NEON_API_KEY`

After the secret exists, the `neon_workflow.yml` PR branch create/delete job will run on the next pull request.
