# TODO

## Admin folder organization

- [ ] Create new folder structure under `src/features/admin/components/` (e.g. `dashboard/`, `sidebar/`, `settings/`, `products/`, `analytics/`, `ui/`).
- [ ] Move existing admin components into appropriate folders.
- [ ] Update all import paths referencing moved files.
- [ ] Ensure `npm run build` and `npm run lint` pass.

## Replace raw HTML tags with MUI components

- [ ] Audit remaining TSX files for raw HTML tags (`div`, `span`, `p`, `form`, `section`, etc.) that still exist.
- [ ] Replace them with MUI equivalents (`Box`, `Typography`, `Button`, `Container`, etc.).
- [ ] Preserve semantics using `Typography component="..."` where needed.
- [ ] Run `npm run lint` and `npm run build`.

## Tailwindcss warning cleanup

- [ ] Finish fixing all className formatting warnings listed in diagnostics (remaining files under about/home/contact).
- [ ] Re-run lint to confirm warnings resolved.
