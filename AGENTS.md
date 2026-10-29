# Babble public site: agent guide

## Scope and priorities

`licketySplitAUS/Babble` supplies legacy/generated clue pages, printable pages, word lists, downloads and static experiments. Netlify builds `r46.me` and proxies selected paths to SelfServeClues. Expert also consumes resources from `licketysplitaus.github.io/Babble`; those are separate delivery paths.

`SelfServeClues` owns modern clues, APIs, saved publication selection, solving/history and recovery. `BabbleExpert` owns Electron/installers. Fix the owning layer and read its guide before cross-repository edits. Avoid duplicating backend or desktop logic here.

Preserve Lickety's familiar assets, compact layout and readable clues. Support ordinary browsers and older embedded Expert clients. Keep lists lean and alphabetical; typing should take priority over hover scrolling. Use existing hosting without introducing recurring costs.

## Commands and checks

Use Node 22 as configured in `netlify.toml`. There is no root `package.json`, npm build/test script or dependency-install step; tools use Node built-ins.

| Task | Command |
| --- | --- |
| Offline routing/transform tests | `node --test tools/clues-routing.test.mjs tools/expert-button.test.mjs` |
| Production-style local build | `node tools/build-clues-site.mjs` |
| Regenerate lists from an explicit dictionary | `./generate-word-lists.ps1 -SourceCsv '<path-to-BabbleWordList.csv>'` |

The default CSV is the related SelfServeClues `public/BabbleWordList.csv`. It is a dictionary, not today's solution. Change the generator and regenerate all lengths for repeated behaviour changes; avoid hand-patching one generated list.

The build reads saved selection from `https://selfserveclues.netlify.app/history-api/publication?config=1`. It must fail if that selection is unavailable/invalid, preserving the prior deployment rather than guessing legacy mode.

The builder copies only `git ls-files`, excluding dot paths, tools, Markdown and build configuration. New public files must be tracked to ship; report omissions without staging unrelated files. It does not clear old output, so existing `dist/` is not proof of a clean deployment's contents. Keep secrets/private artifacts outside tracked public inputs.

Extend suitable existing transform/routing tests before adding new ones; cover relevant behaviour and failures. Inspect affected links, word interactions, printing and embedded use. Docs need no live build; a Netlify build does not verify GitHub Pages resources.

## Source and build map

| Area | Source |
| --- | --- |
| Public pages/assets | Root HTML and image files; preserve filenames, case, URLs and legacy DOM hooks |
| Build/output | `tools/build-clues-site.mjs` copies tracked public inputs to ignored `dist/` |
| Proxy/publication routing | `tools/clues-routing.mjs`, `netlify.toml` |
| Durable page transforms | `tools/expert-button.mjs`, `tools/site-icons.mjs`, `tools/clues-celebration.mjs` |
| Word-list generator | `generate-word-lists.ps1` produces `words-4.html` through `words-12.html` |

For connected-service work use SelfServeClues `docs/AGENT-REFERENCE.md` / `docs/README.md`; for resources use Expert's implementation reference. Read only relevant sections.

## Code Review Rules

For reviews, report actionable defects with a concrete trigger and file/line evidence, not style preferences. Check changed code against these contracts:

- Every build reads the saved Admin publication choice, including legacy generator pushes. Preserve forced old/new clue and printable routes, proxied assets/APIs, `legacy-babbleclues.html` and the operation marker `clues-publication.json` with no-store caching.
- Source code deploy rollback, history-data rollback and changing public route selection are different operations. A preserved legacy page can be stale after its generator stops. Both public sites use Netlify; the legacy route is not independent-provider failover.
- Daily legacy generation can overwrite root clue HTML. Put durable shared additions in existing idempotent build transforms where appropriate; preserve puzzle content and avoid duplicate scripts/buttons. Source-only page inspection can differ from the served transformed HTML.
- Preserve `AddBabbleWord`, `GetAllWords`, `showAll`, legacy form/answer/checkbox hooks and All/On/Off behaviour used by installed Expert versions.
- Current Expert parses exact `<div class="w">word</div>` entries as sorted unique lowercase data, with strict source/path validation and a packaged virtualized viewer. Older apps execute hosted scripts. Preserve click/copy/hash submission and all word lengths for both generations.
- Preserve standalone browser Bulk Add/Grab and fireworks. Embedded Expert hides bulk controls and owns celebration/reporting. Shared browser scripts and the Expert guide/styles are owned by SelfServeClues; update their source there instead of copying divergent versions here.
- `lickety-info.html` has its own favicon/heart assets. Expert also has a packaged Info page; a hosted edit does not automatically change that installed copy.

## Working and delivery

Find relevant symbols first; reuse saved failure logs and batch edits before rebuilding. Avoid whole-file reformatting, migration and dependencies that inflate public payloads. Comment on non-obvious reasons. Resolve minor choices autonomously; plan changes spanning generation/routing/repositories.

Preserve unrelated edits and inspect branch/upstream state before reconciliation. Commits, pushes, deployments, saved publication changes and real messages require task authorization; reuse authorization for that task, not old transcript approvals. A production-branch push can deploy automatically; verify the configured integration before promising Git-only work. Local prototypes stay local when requested.

Inspect final changes/new files for scope drift and missing generated outputs. Report checks/limits per repository; distinguish tracked assets, pushed source, live routes and installed behaviour. A build alone publishes neither site.

Reviewed 29 October 2026. Update this guide alongside changed commands/contracts. Retain recurring, non-obvious rules; remove superseded guidance. Later explicit instructions take precedence.
