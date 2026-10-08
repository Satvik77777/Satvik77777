# GitHub profile redesign preview

Prepared 2026-10-08 for Satvik Saini. This is a reversible preview; the original profile is preserved in Git history.

## Original version

- Original main commit: `c237d197f067340d6f5c45279107614fb29f8faa`.
- Preview branch: `profile-redesign-preview`.
- Original banner, badges, statistics, and snake files were preserved unchanged.
- The redesigned README uses only the new assets under `assets/profile/`.

## User preferences applied

- No job-seeking statement or recruitment messaging in the GitHub introduction.
- Keep LinkedIn, Email, GitHub, and X buttons; add Portfolio.
- Keep the original profile's contact address, `satviksaini7777@gmail.com`, until the user chooses otherwise. The portfolio uses a different address from the résumé.
- Replace the large cat-and-data header with a compact identity, grid, and branching signature.
- Use only the AI interview platform and fintech ledger from the résumé as featured projects.
- Include a decorative request-pipeline animation and project architecture blueprints.
- Keep a contribution snake, with genuine calendar data, separate light/dark palettes, and a visible update date.

## Implementation

`scripts/build-profile.mjs` uses only Node built-ins. It produces the banner, pipeline, project blueprints, contact buttons, public contribution data, and animated calendars. The artwork is original SVG code; no external animation service or token is required.

Contribution data is fetched from GitHub's public contributions endpoint. Date, level, and count come from calendar cells and their tooltips. Parsing fails if required cells/counts are missing; it does not invent fallback figures. The snake follows a path through actual activity cells. The data range, total, active days, and update date use the same snapshot. Source data is recorded in `assets/profile/contributions.json`.

The generator uses undocumented public-calendar HTML, which may change. If GitHub changes that format, fix the parser before refreshing. Failed scheduled updates leave the previous dated graphics in place.

The request-pipeline animation is illustrative, not a running API. Project blueprints are architecture illustrations, not screenshots. SVG animation respects reduced-motion by hiding animated elements and disabling cell fades; the static graphics remain readable.

## Updating

From this repository:

```text
node scripts/build-profile.mjs
```

The workflow `.github/workflows/profile-artwork.yml` supports manual dispatch and a daily refresh at 04:23 UTC. Scheduled runs only become active after the workflow is on the default branch. It uses the repository's GitHub Actions token with contents-write permission solely to commit generated artwork back to the running branch. It needs no personal token or paid service. The daily workflow has not been executed during preview preparation.

## Checks completed

- Generator syntax checked and executed successfully against the public calendar.
- Initial generated snapshot: 369 days, 126 contributions, 37 active days, updated 2026-10-08.
- Light/dark SVG artwork rendered with Sharp and visually inspected for layout and readability.
- README diff whitespace checked.
- README asset references and generated SVG XML checked before upload.
- Original asset files preserved.

Static renders verify artwork layout but do not exercise SVG animation in GitHub's browser rendering. Review the preview branch's rendered README and motion in a browser before merging. The daily workflow still needs a successful real Actions run.

## Reversibility

While the work is on the preview branch, main and the displayed GitHub profile are unchanged. Closing the draft PR leaves the old profile intact.

If later merged, prefer reverting the merge/redesign commit through GitHub or Git rather than rewriting history. For an exact old appearance, restore README.md from the original commit above. All the old graphics are still present, so that README can reference them again. A restore/revert requires the user's instruction; do not use destructive reset or force-push as a rollback shortcut.

## Local workspace

Local clone: `C:\Users\46sat\Desktop\Portfolioo\github-profile`.
Artwork preview PNGs: sibling directory `github-profile-previews/`.
This repository is separate from the portfolio's Sites source repository. Profile changes do not require republishing the portfolio website.
