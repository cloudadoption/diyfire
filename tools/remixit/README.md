# somarc/remixit

Generate a remix brief for a repoless `diyfire` clone, then hand it off to Catalyst.

## Flow

1. Clone a new site with `CloneIt`.
2. Open `/tools/remixit/remixit.html?site=<site-name>`.
3. Point RemixIt at your Catalyst target. On localhost the default is `http://localhost:5173`.
4. Pick the closest industry recipe and adjust the brief.
5. Launch the brief into Catalyst, then verify preview and publish state.

## Why this exists

`CloneIt` creates the repoless site. `somarc/remixit` creates the structured remix brief and launch URL. Catalyst executes the actual redesign and rewrite.

This keeps the MVP honest:

- one-shot local Catalyst handoff through `previewUrl` + `prompt` + `autorun=1`
- shared-code-safe prompts by default
- existing-block-palette redesigns instead of parity-only migrations
- a reusable recipe library that can later move into Catalyst starter prompts
