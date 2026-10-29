# Babble public site: developer guide

This repository owns public `r46.me` pages, legacy generated clues, static assets and dictionary resource pages used by Babble Expert. It routes selected pages/APIs to SelfServeClues. The modern backend belongs to SelfServeClues; the Electron application belongs to BabbleExpert.

Checked against source on **29 October 2026**. Hosting dashboard settings and deployed commits were not reverified for this guide.

## Read next

The shared [developer guide](https://github.com/licketySplitAUS/SelfServeClues/blob/main/docs/DEVELOPER-GUIDE.md), [system architecture](https://github.com/licketySplitAUS/SelfServeClues/blob/main/docs/ARCHITECTURE.md), [design principles](https://github.com/licketySplitAUS/SelfServeClues/blob/main/docs/DESIGN-PRINCIPLES.md) and [build/release handbook](https://github.com/licketySplitAUS/SelfServeClues/blob/main/docs/BUILD-AND-RELEASE.md) describe the connected system. Desktop architecture lives in [BabbleExpert](https://github.com/licketySplitAUS/BabbleExpert/tree/main/docs). `AGENTS.md` contains coding-agent instructions for this repository.

## Source map

| Location | Role |
| --- | --- |
| Root HTML/images/assets | Public pages, printable clues and legacy DOM hooks; preserve filenames and case |
| [`tools/build-clues-site.mjs`](tools/build-clues-site.mjs) | Copies tracked inputs, transforms HTML, emits routing and deployment marker |
| [`tools/clues-routing.mjs`](tools/clues-routing.mjs) | Forced redirects/proxies for old/new clues, printing, assets and APIs |
| [`tools/expert-button.mjs`](tools/expert-button.mjs) | Idempotent Expert links/button changes |
| [`tools/site-icons.mjs`](tools/site-icons.mjs) | Shared icons and Info-page exception |
| [`tools/clues-celebration.mjs`](tools/clues-celebration.mjs) | Browser identity/celebration integration |
| [`generate-word-lists.ps1`](generate-word-lists.ps1) | Dictionary pages for lengths 4–12 |
| [`netlify.toml`](netlify.toml) | Node version, build/publish paths and marker headers |

Legacy Delphi generation is external and can replace daily root clue HTML. Durable repeated changes belong in build transforms where practical. Avoid copying modern frontend/backend logic here.

## Build and routing flow

```mermaid
sequenceDiagram
    participant Source as Tracked public source
    participant Build as Babble build
    participant API as SelfServe publication API
    participant Output as dist output
    participant Netlify
    Build->>API: Read saved mode and operation ID
    API-->>Build: Valid selection or failure
    Note over Build: Fail before copying if selection is unavailable
    Build->>Source: Read git ls-files
    Source-->>Build: Tracked public inputs
    Build->>Output: Copy assets and transform HTML
    Build->>Output: Preserve legacy page; emit routes and marker
    Netlify->>Output: Publish successful build
```

Every build reads saved Admin selection from `https://selfserveclues.netlify.app/history-api/publication?config=1`, including builds following legacy-generator pushes. A 15-second deadline or invalid configuration fails before copying output and leaves the previous deployment serving. The build derives its routing flag from that selection.

With modern clues enabled, `/babbleclues` and `/babbleclues.html` proxy to history-backed clues; printable paths use its print view. `/new-babbleclues` always exposes the modern page; `/legacy-babbleclues.html` preserves transformed legacy clues. Shared assets/APIs proxy to `selfserveclues.netlify.app`. The routing module is authoritative for the complete path list.

Admin checks the deployed `clues-publication.json` mode and operation ID. A saved flag or pushed source is not proof of live routing. Switching back also needs a current legacy-generated puzzle. Both sites use Netlify, so this is not independent-provider failover.

## Local development and delivery

Use Git and Node 22. There is no root npm package or dependency-install step.

```powershell
node --test tools/clues-routing.test.mjs tools/expert-button.test.mjs
node tools/build-clues-site.mjs
```

Tests are offline; the build reads saved selection over the network. Netlify runs the build and publishes `dist`. No checked-in GitHub Actions workflow runs these tests at this review, and the build itself does not run them.

Only `git ls-files` inputs ship. Dot paths, `tools/`, Markdown and build configuration are excluded. Newly created public assets must be tracked. The builder does not clear old `dist`; use a fresh disposable checkout/build directory to verify the shipped file set. Inspect transformed HTML because served content can differ from source. Keep private files outside tracked public inputs.

Check links, print layout and ordinary-browser/embedded interaction for changes. Production-branch pushes can auto-deploy through Netlify's Git integration; confirm the target before publishing. A local build does not deploy. See the shared handbook for verification and rollback boundaries.

## Dictionary resources and installed clients

```powershell
./generate-word-lists.ps1 -SourceCsv '<absolute-path-to-BabbleWordList.csv>'
```

Use PowerShell and the SelfServeClues dictionary CSV. The default path assumes the maintainer's neighbouring checkout layout; the explicit path is portable. These pages are the dictionary, not today's solution. Change the generator and regenerate/review all lengths for shared behaviour changes.

Current Expert downloads `https://licketysplitaus.github.io/Babble/words-N.html` as text, parsing exact `<div class="w">word</div>` entries into a packaged virtualized viewer. Preserve sorted unique lowercase entries of the correct length. Older Expert executes hosted JavaScript, so keep click, clipboard/hash submission, search and scrolling behaviour too.

GitHub Pages is a separate delivery path from Netlify. No checked-in Pages workflow establishes its current settings. Verify repository Pages configuration and actual served resource files for a resource release; a successful `r46.me` deploy is not that verification.

## Design and failure rules

Preserve familiar compact presentation, readable found words, All/On/Off and answer/checkbox hooks. `AddBabbleWord`, `GetAllWords` and `showAll` are installed-client contracts. Embedded Expert hides selected bulk controls and owns its celebration; ordinary browsers retain their own controls/fireworks. Shared browser scripts and Expert guide assets are owned in SelfServeClues.

Transforms must be idempotent and preserve puzzle data. Source/deployment rollback, public routing changes and history-data rollback are different operations. This repository is not a runtime-data backup: use the shared [recovery handbook](https://github.com/licketySplitAUS/SelfServeClues/blob/main/docs/DISASTER-RECOVERY.md) for Blob recovery and off-provider hosting. Update this guide when changing build inputs, routes or compatibility contracts.
