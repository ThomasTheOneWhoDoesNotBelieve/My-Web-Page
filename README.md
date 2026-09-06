# Robin Müller — Photography

Astro photography portfolio prepared for GitHub Pages.

## Local preview

```bash
npm install
npm run dev
```

Then open the localhost address Astro prints.

---

# HOME WALL

To add photographs to the homepage:

```text
src/assets/wall/
```

Drop image files there:

```text
001-naraijuku.jpg
002-matsumoto.jpg
003-toyama.jpg
004-new-photo.jpg
```

The wall is generated automatically. Filenames control the order.

No code editing is required.

---

# PROJECTS

Projects are now folder-driven.

```text
src/content/projects/
├── _TEMPLATE/
├── naraijuku/
│   ├── project.md
│   └── photos/
│       ├── 001.jpg
│       ├── 002.jpg
│       └── 003.jpg
├── matsumoto/
└── toyama/
```

## Add a new project

1. Duplicate:

```text
src/content/projects/_TEMPLATE/
```

2. Rename the copied folder, for example:

```text
kanazawa
```

That folder name automatically becomes the URL:

```text
/projects/kanazawa/
```

3. Edit `project.md`:

```md
---
title: "KANAZAWA"
place: "ISHIKAWA, JAPAN"
date: "OCTOBER 2026"
order: 4
note: "One short sentence about this project."
---
```

4. Drop photographs into:

```text
src/content/projects/kanazawa/photos/
```

Name them:

```text
001.jpg
002.jpg
003.jpg
...
```

The filename determines their order inside the gallery.

5. Optional: add:

```text
src/content/projects/kanazawa/cover.jpg
```

to choose a different image for the Projects index.

If no `cover.jpg` exists, the first gallery photograph is used automatically.

6. Push to GitHub.

Astro automatically creates:
- the new row on `/projects/`
- the next project number (`001`, `002`, etc.)
- the project URL
- the gallery
- the fullscreen image viewer

No route, array, or HTML file needs to be edited.

---

# FULLSCREEN PROJECT VIEWER

Inside every project:

- click any photograph to enlarge it
- `×` closes the preview
- `‹` and `›` move through the project
- Left/Right arrow keys also move through photographs
- Escape closes the preview
- the counter shows the current image number

---

# PROJECT ORDER

`order:` in `project.md` controls the order on the Projects page.

Example:

```text
order: 1
order: 2
order: 3
```

The visible `001 / 002 / 003...` numbering is generated automatically, so you do not type those numbers yourself.

---

# PUBLISHING

```bash
git add .
git commit -m "Update photography"
git push
```

The included GitHub Actions workflow builds and publishes the site to GitHub Pages.
