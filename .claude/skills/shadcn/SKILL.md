---
name: shadcn
description: Always invoke before creating, editing, or reviewing any React UI component in this project — enforces shadcn/ui conventions (composition, semantic color tokens, forms, icons, Tailwind rules). Triggers on any work under resources/js/components, resources/js/features/*/components, resources/js/pages, or resources/js/layouts, and on "shadcn", "ui component", "button", "form", "dialog", "card".
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# shadcn/ui (project skill)

Sumber kebenaran lengkap ada di `.agents/skills/shadcn/SKILL.md` — baca
file itu secara penuh (beserta `rules/*.md` yang direferensikannya) sebelum
menulis atau mengubah komponen UI apa pun. Jangan lewati langkah ini.

## Quick Reference

```bash
# Lihat context project (aliases, base, iconLibrary, resolvedPaths, dll.)
npx shadcn@latest info

# Pasang komponen
npx shadcn@latest add button card dialog

# Preview sebelum menimpa komponen yang sudah ada
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx

# Cari komponen di registry
npx shadcn@latest search -q "sidebar"

# Dapatkan URL dokumentasi & contoh sebuah komponen
npx shadcn@latest docs button dialog select

# Lihat detail item registry yang belum dipasang
npx shadcn@latest view @shadcn/button
```

Untuk aturan detail (forms, styling, composition, icons, preset, registry)
dan referensi command penuh, baca `.agents/skills/shadcn/SKILL.md` dan
`.agents/skills/shadcn/cli.md`.
